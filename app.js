#! /usr/bin/env node
'use strict';

const path = require('path');
const config = require('confi')({
  path: [
    path.join(__dirname, 'conf'),
    path.join(process.cwd(), 'clientkit')
  ],
  context: {
    CKDIR: __dirname
  }
});

const watcher = require('./lib/watcher');

// Tasks
const cssProcessor = require('./tasks/css.js');
const jsProcessor = require('./tasks/script.js');

// Prepare output dir
const mkdirp = require('mkdirp');
mkdirp.sync(path.join(config.CWD, '.dist'));

const watchedStyleFiles = [
  path.join(config.CWD, '**/styles/*.css') // @TODO: make this not sucky
];

watcher(watchedStyleFiles, config.stylesheets, (input, output) => {
  cssProcessor(config, __dirname, input, output);
}, config.core.rebuildDelay);


const watchedScriptFiles = [
  path.join(config.CWD, 'scripts', '**/*.js'),
];
watcher(watchedScriptFiles, config.scripts, (input, output) => {
  jsProcessor(config, __dirname, input, output);
}, config.core.rebuildDelay);
