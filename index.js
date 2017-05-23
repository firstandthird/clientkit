#!/usr/bin/env node

const main = require('taskkit');
const path = require('path');

const configPaths = [path.join(__dirname, 'conf')];

const context = {
  CKDIR: __dirname
};

main({
  name: 'clientkit',
  version: require(path.join(__dirname, 'package.json')).version,
  configPaths,
  context
});
