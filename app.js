#! /usr/bin/env node
'use strict';
const path = require('path');
const yargs = require('yargs');
const Logr = require('logr');
const log = new Logr({
  type: 'cli',
  renderOptions: {
    cli: {
      lineColor: 'cyan'
    }
  }
});

const argv = yargs
.option('mode', {
  describe: 'either "dev" or "prod" mode',
  default: 'prod'
})
.option('config', {
  describe: 'a path to your configuration files',
  default: path.join(process.cwd(), 'clientkit')
})
.option('debug', {
  describe: 'debug mode',
  type: Boolean,
  default: false
})
.help('h')
.alias('h', 'help')
.env(true)
.argv;

log(`Using local config directory: ${argv.config}`);
// const configPath = [path.join(__dirname, 'conf')];
// if (argv.config) {
//   configPath.push(argv.config);
// }
const config = require('confi')({
  path: [
    path.join(__dirname, 'conf'),
    argv.config
  ],
  context: {
    CKDIR: __dirname
  }
});

if (argv.debug || argv._.indexOf('debug') > -1) {
  log(JSON.stringify(config, null, '  '));
}

const watcher = require('./lib/watcher');

// Tasks
const cssProcessor = require('./tasks/css.js');
const jsProcessor = require('./tasks/script.js');

// Prepare output dir
const mkdirp = require('mkdirp');
mkdirp.sync(config.core.dist);
if (argv.mode === 'dev' || argv._.dev || argv._.indexOf('dev') > -1) {
  const watchedStyleFiles = [
    path.join(config.core.assetPath, '**/*.css') // @TODO: make this not sucky
  ];

  watcher(watchedStyleFiles, config.stylesheets, (input, output) => {
    cssProcessor(config, __dirname, input, output);
  }, config.core.rebuildDelay);

  const watchedScriptFiles = [
    path.join(config.core.assetPath, '**/*.js'),
  ];
  watcher(watchedScriptFiles, config.scripts, (input, output) => {
    jsProcessor(config, __dirname, input, output);
  }, config.core.rebuildDelay);
} else {
  if (config.stylesheets) {
    Object.keys(config.stylesheets).forEach(style => cssProcessor(config, __dirname, style, config.stylesheets[style]));
  }

  if (config.scripts) {
    Object.keys(config.scripts).forEach(script => jsProcessor(config, __dirname, script, config.scripts[script]));
  }
}
