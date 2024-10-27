'use strict';

const api_version = 'v1';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const getRoute = path => `/${api_version}/${path}`;

  const ping = controller[api_version].ping;
  const illust = controller[api_version].illust;
  const user = controller[api_version].user;
  const search = controller[api_version].search;
  const ugoira = controller[api_version].ugoira;

  router.get('ping', ping);

  router.get(getRoute('illust/search'), illust.search);
  router.get(getRoute('illust/rank'), illust.rank);
  router.get(getRoute('illust/detail'), illust.detail);
  router.get(getRoute('illust/related'), illust.related);

  router.get(getRoute('ugoira/meta'), ugoira.meta);

  router.get(getRoute('user/detail'), user.detail);
  router.get(getRoute('user/illusts'), user.illusts);
  router.get(getRoute('user/search'), user.search);

  router.get(getRoute('search/suggestions'), search.suggestions);
};
