
'use strict';

const Controller = require('egg').Controller;
const Response = require('../../utils/simpleResponse');

class PingController extends Controller {
  async ping() {
    const { ctx } = this;
    return Response(ctx, { pong: 1 });
  }
}

module.exports = PingController;
