#!/usr/bin/env node

const main = require('clientkit-core');
const path = require('path');

const configPaths = [path.join(__dirname, 'conf')];

const context = {
  CKDIR: __dirname
};

main(configPaths, context);
