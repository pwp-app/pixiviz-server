'use strict';

const api_version = 'v1';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.get(`/${api_version}/illust/detail`, controller[api_version].illust.detail);
};
