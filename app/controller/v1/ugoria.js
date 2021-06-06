'use strict';

const Controller = require('egg').Controller;
const Response = require('../../utils/simpleResponse');

class UgoriaController extends Controller {
  async meta() {
    const { ctx } = this;
    ctx.validate({ id: 'number' }, ctx.query);
    return Response(ctx, await this.service.pixiv.ugoriaMeta(ctx.query.id));
  }
}

module.exports = UgoriaController;
