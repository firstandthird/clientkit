#!/usr/bin/env node

const main = require('runkit');
const path = require('path');

const configPaths = [path.join(__dirname, 'conf')];

const context = {
  CKDIR: __dirname
};

main({
  name: 'clientkit',
  version: require('./package.json').version,
  configPaths,
  context
});
