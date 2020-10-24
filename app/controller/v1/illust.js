'use strict';

const Controller = require('egg').Controller;
const Response = require('../../utils/simpleResponse');

class IillustController extends Controller {
  async search() {
    const { ctx } = this;
    ctx.validate({ word: 'string', page: 'number' }, ctx.query);

    const keyword = ctx.query.word.trim();
    // 敏感词检查
    if (ctx.sensitiveWords.includes(keyword)) {
      return Response(ctx, {
        sensitive: true,
        message: 'Sentitive word detected, searching has been blocked.',
      });
    }

    return Response(ctx, await this.service.pixiv.searchIllust(keyword, ctx.query.page));
  }
  async rank() {
    const { ctx } = this;
    ctx.validate({ mode: 'string', date: 'date', page: 'number' }, ctx.query);
    return Response(ctx, await this.service.pixiv.illustRank(ctx.query.mode, ctx.query.date, ctx.query.page, ctx.query.pageSize));
  }
  async detail() {
    const { ctx } = this;
    ctx.validate({ id: 'number' }, ctx.query);
    return Response(ctx, await this.service.pixiv.illustDetail(ctx.query.id));
  }
  async related() {
    const { ctx } = this;
    ctx.validate({ id: 'number', page: 'number' }, ctx.query);
    return Response(ctx, await this.service.pixiv.illustRelated(ctx.query.id, ctx.query.page));
  }
}

module.exports = IillustController;
