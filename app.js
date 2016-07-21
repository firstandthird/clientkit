#! /usr/bin/env node
'use strict';
const path = require('path');
const yargs = require('yargs');
const Logr = require('logr');
const watcher = require('./lib/watcher');
const mkdirp = require('mkdirp');

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
  describe: 'set to "dev" mode to continuously monitor your files and auto-process when a change is made',
  default: 'prod'
})
.option('config', {
  describe: 'a path to your configuration files',
  default: path.join(process.cwd(), 'clientkit')
})
.option('debug', {
  describe: 'debug mode, will print verbose text',
  type: Boolean,
  default: false
})
.help('h')
.alias('h', 'help')
.env(true)
.argv;

log(`Using local config directory: ${argv.config}`);
const defaultConf = path.join(__dirname, 'conf');
let jsWatcher = false; // watcher we will use to watch js files
let cssWatcher = false; // the same, for css

const runAll = () => {
  // Tasks
  const cssProcessor = require('./tasks/css.js');
  const jsProcessor = require('./tasks/script.js');
  const config = require('confi')({
    path: [
      defaultConf,
      argv.config
    ],
    context: {
      CKDIR: __dirname
    }
  });
  const watchedScriptFiles = config.core.files.scripts;
  const watchedStyleFiles = config.core.files.css;
  if (argv.debug || argv._.indexOf('debug') > -1) {
    log(JSON.stringify(config, null, '  '));
  }

  mkdirp.sync(config.core.dist);
  if (argv.mode === 'dev' || argv._.dev || argv._.indexOf('dev') > -1) {
    // remove any existing css file watchers:
    if (cssWatcher) {
      cssWatcher.close();
    }
    cssWatcher = watcher(watchedStyleFiles, config.stylesheets, (input, output) => {
      cssProcessor(config, __dirname, input, output);
    }, config.core.rebuildDelay);
    // remove any existing js file watchers:
    if (jsWatcher) {
      jsWatcher.close();
    }
    jsWatcher = watcher(watchedScriptFiles, config.scripts, (input, output) => {
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
};

// dev mode will watch your conf files and reload everything when they are changed:
if (argv.mode === 'dev' || argv._.dev || argv._.indexOf('dev') > -1) {
  const config = require('confi')({
    path: [
      defaultConf,
      argv.config
    ],
    context: {
      CKDIR: __dirname
    }
  });
  const watchedConfigFiles = config.core.files.yaml;
  watcher(watchedConfigFiles, [''], () => {
    runAll();
  }, 100);
} else {
  runAll();
}
