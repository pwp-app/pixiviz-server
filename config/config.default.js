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
    domainWhiteList: ['http://localhost:8000', 'https://pixivc.pwp.app'],
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
        ctx.body = JSON.stringify({
          code: 422,
          status: 'error',
          message: 'Request validation failed.',
        });
      } else {
        ctx.body = JSON.stringify({
          code: 500,
          status: 'error',
          message: 'Unknown internal error occured.',
        });
      }
      // 统一视为正常回复，用code区分错误
      ctx.set({
        'Content-Type': 'application/json',
      });
      ctx.status = 200;
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
  config.middleware = ['notfoundHandler', 'compress'];

  config.compress = {
    threshold: 2048,
  };

  // add your user config here
  const userConfig = {
    appName: 'pixivc-server',
  };

  return {
    ...config,
    ...userConfig,
  };
};
