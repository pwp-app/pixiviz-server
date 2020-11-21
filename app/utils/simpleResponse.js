'use strict';

module.exports = (ctx, data) => {
  ctx.status = 200;
  ctx.body = data;
  ctx.set({
    'Access-Control-Expose-Headers': 'pixiviz-cache',
    'pixiviz-cache': 'true',
  });
};
