'use strict';

const crypto = require('crypto');

module.exports = {
  md5(str) {
    const hash = crypto.createHash('md5');
    return hash.update(str).digest('hex');
  },
};