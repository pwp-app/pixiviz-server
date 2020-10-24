'use strict';

const Controller = require('egg').Controller;
const Response = require('../../utils/simpleResponse');

class SearchController extends Controller {
  async suggestions() {
    const { ctx } = this;
    ctx.validate({ keyword: 'string' }, ctx.query);
    return Response(ctx, await this.service.pixiv.searchSuggestions(encodeURIComponent(ctx.query.keyword)));
  }
}

module.exports = SearchController;