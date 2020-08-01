'use strict';

const Controller = require('egg').Controller;
const Response = require('../../utils/simple_response');

class UserController extends Controller {
  async detail() {
    const { ctx } = this;
    ctx.validate({ id: 'number' }, ctx.query);
    return Response(ctx, await this.service.pixiv.userDetail(ctx.query.id));
  }
  async illusts() {
    const { ctx } = this;
    ctx.validate({ id: 'number' }, ctx.query);
    return Response(ctx, await this.service.pixiv.userIllusts(ctx.query.id));
  }
}

module.exports = UserController;
