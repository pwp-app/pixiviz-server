'use strict';

const fs = require('fs');
const path = require('path');

let sensitiveWords = [];

// read in
const dirPath = path.resolve(__dirname, '../../resource/sensitive');
const dir = fs.readdirSync(dirPath);

dir.forEach(file => {
  if (path.extname(file) === '.txt') {
    const words = fs.readFileSync(path.resolve(dirPath, file), {
      encoding: 'utf-8',
    });
    if (words) {
      sensitiveWords = sensitiveWords.concat(words.split('\n'));
    }
  }
});

module.exports = () => {
  return async function sensitiveWordLoader(ctx, next) {
    ctx.sensitiveWords = new Set(sensitiveWords.map(line => Buffer.from(line, 'base64').toString('utf-8').trim()));
    await next();
  };
};
