'use strict';

const Controller = require('egg').Controller;
const Response = require('../../utils/simpleResponse');

class UserController extends Controller {
  async detail() {
    const { ctx } = this;
    ctx.validate({ id: 'number' }, ctx.query);
    return Response(ctx, await this.service.pixiv.userDetail(ctx.query.id));
  }
  async illusts() {
    const { ctx } = this;
    ctx.validate({ id: 'number', page: 'number' }, ctx.query);
    return Response(ctx, await this.service.pixiv.userIllusts(ctx.query.id, ctx.query.page));
  }
}

module.exports = UserController;
