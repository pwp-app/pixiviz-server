'use strict';

/** @type Egg.EggPlugin */
module.exports = {
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
};
