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
const cssProcessor = require('./tasks/css.js');
const mkdirp = require('mkdirp');
const debounce = require('lodash.debounce');

mkdirp.sync(path.join(config.CWD, '.dist'));

const watchedFiles = [
  path.join(__dirname, 'styles', '**/*.css'),
];
const stylesheets = Object.keys(config.stylesheets);

const watcher = chokidar.watch(watchedFiles, {
  persistent: true
});

watcher.on('all', debounce(() => {
  for (const stylesheet of stylesheets) {
    cssProcessor(config, __dirname, stylesheet, config.stylesheets[stylesheet]);
  }
}, config.core.rebuildDelay));
