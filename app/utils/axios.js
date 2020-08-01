'use strict';

const axios = require('axios');
const qs = require('qs');

axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [
  function(data) {
    return qs.stringify(data, {
      arrayFormat: 'brackets',
    });
  },
];

module.exports = axios;
