/* eslint valid-jsdoc: "off" */

'use strict';

module.exports = () => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  config.keys = process.env.SAFE_KEY ? `pixiviz-${process.env.SAFE_KEY}` : '';

  config.cluster = {
    listen: {
      path: '',
      port: Number(process.env.PORT) || 3000,
    },
  };

  config.redis = {
    client: {
      port: 6379,
      host: process.env.REDIS_HOST || 'pixiviz-redis',
      db: 1,
      password: process.env.REDIS_PASSWORD,
    },
  };

  config.security = {
    xframe: {
      value: 'SAMEORIGIN',
    },
    csrf: {
      enable: false,
    },
    domainWhiteList: ['https://pixiviz.pwp.app', 'https://pixiviz.xyz'],
  };

  config.cors = {
    allowMethods: 'GET,POST',
  };

  config.validate = {
    convert: true,
    widelyUndefined: true,
  };

  config.onerror = {
    all: (err, ctx) => {
      if (ctx.status === 422) {
        ctx.body = {
          code: 422,
          status: 'error',
          message: 'Request validation failed.',
        };
      } else {
        ctx.body = {
          code: 500,
          status: 'error',
          message: 'Unknown internal error occured.',
        };
      }
      ctx.set({
        'Content-Type': 'application/json',
      });
    },
  };

  config.logrotator = {
    maxFileSize: 100 * 1024 * 1024, // 100 MB
    maxFiles: 10,
    maxDays: 14,
  };

  // add your middleware config here
  config.middleware = ['sensitiveWordLoader', 'notFoundHandler', 'compress'];

  config.compress = {
    threshold: 2048,
  };

  // add your user config here
  const userConfig = {
    appName: 'pixiviz-server',
  };

  return {
    ...config,
    ...userConfig,
  };
};
