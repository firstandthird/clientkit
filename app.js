#! /usr/bin/env node
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
const chokidar = require('chokidar');

// Tasks
const cssProcessor = require('./tasks/css.js');
const jsProcessor = require('./tasks/script.js');

const mkdirp = require('mkdirp');
const debounce = require('lodash.debounce');

mkdirp.sync(path.join(config.CWD, '.dist'));

const watchedFiles = [
  path.join(__dirname, 'styles', '**/*.css'),
  path.join(__dirname, 'scripts', '**/*.js'),
];
const stylesheets = Object.keys(config.stylesheets);
const scripts = Object.keys(config.scripts);

const watcher = chokidar.watch(watchedFiles, {
  persistent: true
});

watcher.on('all', debounce(() => {
  for (const stylesheet of stylesheets) {
    cssProcessor(config, __dirname, stylesheet, config.stylesheets[stylesheet]);
  }

  for (const script of scripts) {
    jsProcessor(config, __dirname, script, config.scripts[script]);
  }
}, config.core.rebuildDelay));
