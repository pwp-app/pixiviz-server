'use strict';

const Service = require('egg').Service;
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const Hash = require('../utils/hash');

const axios = require('../utils/axios');

const BASE_URL = 'https://app-api.pixiv.net';
const CLIENT_ID = 'MOBrBDS8blbauoSck0ZfDbtuzpyT';
const CLIENT_SECRET = 'lsACyCD94FhDUtGTXi3QzcFE2uU1hqtDaKeqrdwj';
const HASH_SECRET = '28c1fdd170a5204386cb1313c7077b34f83e4aaf4aa829ce78c231e05b0bae2c';
const HEADERS = {
  'User-Agent': 'PixivAndroidApp/5.0.234 (Android 11; Pixel 5)',
};

// 60 mins
const DATA_CACHE_TIME = 3600;
// 12 hours
const DATA_LONG_CACHE_TIME = 43200;

class PixivService extends Service {
  async getHeaders() {
    if (!this.ctx.app.auth) {
      await this.login();
    }
    return {
      ...HEADERS,
      Authorization: `Bearer ${this.ctx.app.auth.access_token}`,
    };
  }
  getNoAuthHeaders() {
    return {
      ...HEADERS,
    };
  }
  getSecretHeaders() {
    const datetime = moment().format();
    return {
      ...HEADERS,
      'X-Client-Time': datetime,
      'X-Client-Hash': Hash.md5(`${datetime}${HASH_SECRET}`),
    };
  }
  async generalRequest(url, data) {
    return axios.get(BASE_URL + url, {
      headers: await this.getHeaders(),
      params: data,
    });
  }
  generalNoAuthRequest(url, data) {
    return axios.get(BASE_URL + url, {
      headers: this.getNoAuthHeaders(),
      params: data,
    });
  }
  setAuth(auth) {
    this.ctx.app.auth = auth;
  }
  async login() {
    const { ctx } = this;
    const cached = await this.service.redis.get('pixiviz_auth');
    if (cached) {
      this.setAuth(cached);
      return;
    }
    const token = ctx.app.config.refreshToken;
    await this.refreshToken(token);
  }
  async refreshToken(token) {
    const tokenFilePath = process.env.IN_DOCKER ? '/usr/local/pixiviz-api/token/refreshToken' : path.resolve(__dirname, '../../token/refreshToken');
    let storedToken;
    try {
      if (fs.existsSync(tokenFilePath)) {
        storedToken = fs.readFileSync(tokenFilePath, { encoding: 'utf-8' });
      }
    } catch (err) {
      console.error('Failed to read token file:', {
        path: tokenFilePath,
        error: err.message,
        stack: err.stack,
      });
    }

    try {
      const res = await axios.post(
        'https://oauth.secure.pixiv.net/auth/token',
        {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          get_secure_url: true,
          include_policy: true,
          grant_type: 'refresh_token',
          refresh_token: (storedToken ? storedToken : token) || this.ctx.app.auth.refresh_token,
        },
        {
          headers: {
            ...this.getSecretHeaders(),
          },
        }
      );
      if (res.data?.response) {
        const auth = res.data.response;
        this.service.redis.set('pixiviz_auth', JSON.stringify(auth), auth.expires_in);
        fs.writeFileSync(tokenFilePath, auth.refresh_token, { encoding: 'utf-8' });
        this.setAuth(auth);
      } else {
        throw new Error('Token refresh failed: Empty response data');
      }
    } catch (err) {
      console.error('Token refresh failed:', {
        error: err.message,
        response: err.response?.data,
        status: err.response?.status,
        stack: err.stack,
      });
      throw err;
    }
  }
  // 通用方法
  async fetchFromRemote(CACHE_KEY, url, params, long_cache = false) {
    const data = await this.service.redis.get(CACHE_KEY);
    if (data) {
      return data;
    }

    const res = await this.generalRequest(url, params);

    if (res.data) {
      // filter
      if (res.data.illust) {
        const tags = res.data.illust.tags.map(tagItem => tagItem.name);
        const sensitive =
          tags
            .reduce((res, tag) => {
              return res || this.ctx.sensitiveWords.verify(tag);
            }, false)
            || this.ctx.sensitiveWords.verify(res.data.illust.title)
            || this.ctx.sensitiveWords.verify(res.data.illust.caption)
            || (res.data.illust.user?.name && this.ctx.sensitiveWords.verify(res.data.illust.user.name));
        if (sensitive) {
          res.data.illust.x_restrict = 1;
        }
        if (res.data.illust.x_restrict) {
          delete res.data.illust.title;
          delete res.data.caption;
          delete res.data.illust.tags;
          delete res.data.illust.meta_single_page;
          delete res.data.illust.caption;
          delete res.data.illust.user;
        }
        if (Array.isArray(res.data.illusts)) {
          res.data.illusts.filter(img => {
            const tags = img.tags.map(tagItem => tagItem.name);
            const sensitive =
              tags
                .reduce((res, tag) => {
                  return res || this.ctx.sensitiveWords.verify(tag);
                }, false)
                || this.ctx.sensitiveWords.verify(img.title)
                || (img.user?.name && this.ctx.sensitiveWords.verify(img.user.name));
            return !sensitive;
          });
        }
        if (Array.isArray(res.data.user_previews)) {
          res.data.user_previews.filter(preview => {
            const sensitive =
              this.ctx.sensitiveWords.verify(preview.user.name)
              || preview.illusts.reduce((res, curr) => {
                return res
                  && this.ctx.sensitiveWords.verify(curr.title)
                  && this.ctx.sensitiveWords.verify(curr.tags.map(tag => tag.name).join(', '));
              }, false);
            return !sensitive;
          });
        }
        if (res.data.user && res.data.profile) {
          if (this.ctx.sensitiveWords.verify(res.data.user.name) && this.sensitiveWords.verify(res.data.user.comment)) {
            this.service.redis.set(CACHE_KEY, null, long_cache ? DATA_LONG_CACHE_TIME : DATA_CACHE_TIME);
            return null;
          }
        }
      }
      this.service.redis.set(CACHE_KEY, res.data, long_cache ? DATA_LONG_CACHE_TIME : DATA_CACHE_TIME);
      return res.data;
    }
    return null;
  }
  // 搜索
  async searchIllust(word, page) {
    const offset = (page - 1) * 30;
    const CACHE_KEY = `pixiviz_rank_${word}_${page}`;
    return await this.fetchFromRemote(CACHE_KEY, '/v1/search/illust', {
      word,
      search_target: 'title_and_caption',
      offset,
    });
  }
  // 排行榜
  async illustRank(mode, date, page) {
    const offset = (page - 1) * 30;
    const CACHE_KEY = `pixiviz_rank_${mode}_${date}_${page}`;
    return await this.fetchFromRemote(
      CACHE_KEY,
      '/v1/illust/ranking',
      {
        mode,
        date,
        offset,
      },
      true
    );
  }
  // 插画详情
  async illustDetail(id) {
    const CACHE_KEY = `pixiviz_illust_detail_${id}`;
    return await this.fetchFromRemote(CACHE_KEY, '/v1/illust/detail', {
      illust_id: id,
    });
  }
  // 插画关联
  async illustRelated(id, page) {
    const offset = (page - 1) * 30;
    const CACHE_KEY = `pixiviz_illust_related_${id}_${page}`;
    return await this.fetchFromRemote(
      CACHE_KEY,
      '/v2/illust/related',
      {
        illust_id: id,
        offset,
      },
      true
    );
  }
  // 动图数据
  async ugoiraMeta(id) {
    const CACHE_KEY = `pixiviz_illust_ugoira_${id}`;
    return await this.fetchFromRemote(CACHE_KEY, '/v1/ugoira/metadata', {
      illust_id: id,
    });
  }
  // 用户信息
  async userDetail(id) {
    const CACHE_KEY = `pixiviz_user_detail_${id}`;
    return await this.fetchFromRemote(CACHE_KEY, '/v1/user/detail', {
      user_id: id,
    });
  }
  async userIllusts(id, page) {
    const offset = (page - 1) * 30;
    const CACHE_KEY = `pixiviz_user_illusts_${id}_${page}`;
    return await this.fetchFromRemote(CACHE_KEY, '/v1/user/illusts', {
      user_id: id,
      offset,
    });
  }
  async searchUser(word, page) {
    const offset = (page - 1) * 10;
    const CACHE_KEY = `pixiviz_user_search_${word}_${page}`;
    return await this.fetchFromRemote(CACHE_KEY, '/v1/search/user', {
      word,
      offset,
    });
  }
  async searchSuggestions(keyword) {
    const CACHE_KEY = `pixiviz_suggestions_${keyword}`;
    const data = await this.service.redis.get(CACHE_KEY);
    if (data) {
      return data;
    }
    if (this.ctx.sensitiveWords.verify(keyword)) {
      return [];
    }
    try {
      const res = await axios.get(`https://www.pixiv.net/ajax/search/artworks/${keyword}?mode=all&lang=zh`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4321.0 Safari/537.36 Edg/88.0.702.0',
          Referer: 'https://www.pixiv.net/',
        },
      });
      if (!res?.data) {
        console.warn('Search suggestions returned empty response:', { keyword });
        return null;
      }
      const tags = (res.data.body?.relatedTags || []).filter(tag => !this.ctx.sensitiveWords.verify(tag));
      this.service.redis.set(CACHE_KEY, tags, DATA_LONG_CACHE_TIME);
      return tags;
    } catch (err) {
      console.error('Failed to fetch search suggestions:', {
        keyword,
        error: err.message,
        response: err.response?.data,
        status: err.response?.status,
        stack: err.stack,
      });
      throw err;
    }
  }
}

module.exports = PixivService;
