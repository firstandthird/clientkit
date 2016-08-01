'use strict';
const mkdirp = require('mkdirp');
const watcher = require('../lib/watcher');
const fs = require('fs');
const Logr = require('logr');

const log = new Logr({
  type: 'cli',
  renderOptions: {
    cli: {
      lineColor: 'cyan'
    }
  }
});

let jsWatcher = false; // watcher we will use to watch js files
let cssWatcher = false; // the same, for css
module.exports.loadConfig = (defaultConf, argv) => {
  try {
    fs.accessSync(argv.config, fs.F_OK);
  } catch (e) {
    log(e);
    return false;
  }
  // first set up configuration based on the config yamls:
  const conf = require('confi')({
    path: [
      defaultConf,
      argv.config
    ],
    context: {
      CKDIR: process.cwd(),
      CONFIGDIR: argv.config
    }
  });
  // second, set up the configuration based on any command line options:
  if (argv.mode === 'dev' || argv._.dev || argv._.indexOf('dev') > -1) {
    conf.mode = 'dev';
  } else {
    conf.mode = 'prod';
  }
  return conf;
};

module.exports.runDev = (config) => {
  const cssProcessor = require('../tasks/css.js');
  const jsProcessor = require('../tasks/script.js');
  const watchedScriptFiles = config.core.watch.scripts;
  const watchedStyleFiles = config.core.watch.css;
  mkdirp.sync(config.core.dist);
  // remove any existing css file watchers:
  if (cssWatcher) {
    cssWatcher.close();
  }
  cssWatcher = watcher(watchedStyleFiles, config.stylesheets, (input, output) => {
    cssProcessor.runTaskAndWrite(config, process.cwd(), input, output);
  }, config.core.rebuildDelay);
  // remove any existing js file watchers:
  if (jsWatcher) {
    jsWatcher.close();
  }
  jsWatcher = watcher(watchedScriptFiles, config.scripts, (input, output) => {
    jsProcessor(config, process.cwd(), input, output);
  }, config.core.rebuildDelay);
};

module.exports.runAll = (config) => {
  const cssProcessor = require('../tasks/css.js');
  const jsProcessor = require('../tasks/script.js');
  // Tasks
  mkdirp.sync(config.core.dist);
  if (config.stylesheets) {
    Object.keys(config.stylesheets).forEach(style => cssProcessor.runTaskAndWrite(config, process.cwd(), style, config.stylesheets[style]));
  }
  if (config.scripts) {
    Object.keys(config.scripts).forEach(script => jsProcessor(config, process.cwd(), script, config.scripts[script]));
  }
};
