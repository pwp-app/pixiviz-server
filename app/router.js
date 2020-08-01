'use strict';

const api_version = 'v1';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const getRoute = path => `/${api_version}/${path}`;

  const illust = controller[api_version].illust;
  const user = controller[api_version].user;

  router.get(getRoute('illust/search'), illust.search);
  router.get(getRoute('illust/rank'), illust.rank);
  router.get(getRoute('illust/detail'), illust.detail);
  router.get(getRoute('illust/related'), illust.related);

  router.get(getRoute('user/detail'), user.detail);
  router.get(getRoute('user/illusts'), user.illusts);
};
