'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  static: {
    enable: false,
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  logrotator: {
    enable: true,
    package: 'egg-logrotator',
  },
};
