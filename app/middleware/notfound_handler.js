'use strict';

module.exports = () => {
    return async function notFoundHandler(ctx, next) {
        await next();
        if (ctx.status === 404 && !ctx.body) {
            ctx.status = 200;
            ctx.body = {
                code: 404,
                status: 'not_found',
                message: 'API not found',
            };
        }
    };
};