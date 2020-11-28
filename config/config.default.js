/* eslint valid-jsdoc: "off" */

'use strict';

const keys = require('./keys');

module.exports = () => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  config.cluster = {
    listen: {
      path: '',
      port: 7702,
      hostname: '0.0.0.0',
    },
  };

  config.keys = keys.cookie;

  config.security = {
    xframe: {
      value: 'SAMEORIGIN',
    },
    csrf: {
      enable: false,
    },
    domainWhiteList: ['http://localhost:8000', 'https://pixiviz.pwp.app'],
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

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: keys.redis,
      db: 2,
    },
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
