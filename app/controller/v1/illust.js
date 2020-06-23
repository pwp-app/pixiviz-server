'use strict';

const Controller = require('egg').Controller;
const Response = require('../../utils/simple_response');

class IillustController extends Controller {
    async detail() {
        const { ctx } = this;
        ctx.validate({ id: 'number' }, ctx.query);
        return Response(ctx, await this.service.pixiv.illustDetail(ctx.query.id));
    }
}

module.exports = IillustController;
