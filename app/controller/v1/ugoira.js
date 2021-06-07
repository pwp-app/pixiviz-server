'use strict';

const Controller = require('egg').Controller;
const Response = require('../../utils/simpleResponse');

class UgoiraController extends Controller {
  async meta() {
    const { ctx } = this;
    ctx.validate({ id: 'number' }, ctx.query);
    return Response(ctx, await this.service.pixiv.ugoiraMeta(ctx.query.id));
  }
}

module.exports = UgoiraController;
