'use strict';

const Service = require('egg').Service;

class RedisService extends Service {
    async set(key, value, seconds) {
        const { redis } = this.app;
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        if (seconds) {
            return await redis.set(key, value, 'EX', seconds);
        }
        return await redis.set(key, value);
    }

    async get(key) {
        const { redis } = this.app;
        let data = await redis.get(key);
        if (!data) {
            // 统一成undefined
            return undefined;
        }
        try {
            data = JSON.parse(data);
        } catch (e) {
            // 不是JSON
            return data;
        }
        return data;
    }

    async del(key) {
        const { redis } = this.app;
        return await redis.del(key);
    }
}

module.exports = RedisService;