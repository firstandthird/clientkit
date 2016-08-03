'use strict';
const mkdirp = require('mkdirp');
const watcher = require('../lib/watcher');

let jsWatcher = false; // watcher we will use to watch js files
let cssWatcher = false; // the same, for css

module.exports.runDev = (config, log) => {
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

module.exports.runAll = (config, log) => {
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
