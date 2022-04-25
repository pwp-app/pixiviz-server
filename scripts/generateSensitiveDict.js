'use strict';

const path = require('path');
const fs = require('fs');

const dictSourceDir = path.resolve(__dirname, '../resource/sensitive');
const dirInfo = fs.readdirSync(dictSourceDir);

dirInfo.forEach(fileName => {
  const filePath = path.resolve(dictSourceDir, fileName);
  const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
  const transformed = fileContent.split('\n').map(line => Buffer.from(line, 'utf-8').toString('base64')).join('\n');
  fs.writeFileSync(path.resolve(dictSourceDir, fileName.replace('_source', '')), transformed, { encoding: 'utf-8' });
});
