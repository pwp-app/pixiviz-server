'use strict';

const Subscription = require('egg').Subscription;

class RefreshToken extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '45m',
      type: 'all',
    };
  }

  async subscribe() {
    await this.service.pixiv.refreshToken();
  }
}

module.exports = RefreshToken;
