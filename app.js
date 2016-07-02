#! /usr/bin/env node
'use strict';

const path = require('path');

let mode = 'prod';
let confPath = path.join(process.cwd(), 'clientkit');

if (process.argv.indexOf('dev') !== -1) {
  mode = 'dev';
}

if (process.argv.indexOf('--config') !== -1 && process.argv.indexOf('--config') !== process.argv.length - 1) {
  confPath = process.argv[process.argv.indexOf('--config') + 1];
}

console.log(`Using local config directory: ${confPath}`);

const config = require('confi')({
  path: [
    path.join(__dirname, 'conf'),
    confPath
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
mkdirp.sync(config.core.dist);

if (mode === 'dev') {
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
} else {
  if (config.stylesheets) {
    Object.keys(config.stylesheets).forEach(style => cssProcessor(config, __dirname, style, config.stylesheets[style]));
  }

  if (config.scripts) {
    Object.keys(config.scripts).forEach(script => cssProcessor(config, __dirname, script, config.scripts[script]));
  }
}
