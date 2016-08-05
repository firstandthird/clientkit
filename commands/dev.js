'use strict';
const mkdirp = require('mkdirp');
const watcher = require('../lib/watcher');
const configHandler = require('../lib/config.js');
const fs = require('fs');
const reduce = require('lodash.reduce');
const styleguide = require('../commands/styleguide.js');
const path = require('path');
let configWatcher = false;
let jsWatcher = false; // watcher we will use to watch js files
let cssWatcher = false; // the same, for css
let cssProcessor;
let jsProcessor;
let currentConfig;

const needsNewCss = (newConfig, oldConfig) => {
  return true;
};

const updateCss = (newConfig, oldConfig) => {
  Object.keys(newConfig.stylesheets).forEach((outputFileName) => {
    cssProcessor.runTaskAndWrite(newConfig, process.cwd(), outputFileName, newConfig.stylesheets[outputFileName]);
  });
};

const needsNewJs = (newConfig, oldConfig) => {
  if (newConfig.scripts) {
    return true;
  }
};

const updateJs = (newConfig, oldConfig) => {
  Object.keys(newConfig.scripts).forEach((outputFileName) => {
    jsProcessor(newConfig, process.cwd(), outputFileName, newConfig.scripts[outputFileName]);
  });
};

const updateWatcher = (newWatchList, oldWatchlist, watcher) => {
  // remove any files from css watcher that are not in newConfig
  oldWatchlist.forEach((watchDirective) => {
    if (newWatchList.indexOf(watchDirective) < 0) {
      watcher.unwatch(watchDirective);
    }
  });
  // add any new files to css watcher
  newWatchList.forEach((watchDirective) => {
    if (oldWatchlist.indexOf(watchDirective) < 0) {
      watcher.add(watchDirective);
    }
  });
};

const onUpdateConfig = (newConfig, argv, log) => {
  if (argv.debug || argv._.indexOf('debug') > -1) {
    log(JSON.stringify(newConfig, null, '  '));
  }
  // make a new dist directory if needed:
  if (currentConfig.core.dist !== newConfig.core.dist || !fs.existsSync(newConfig.core.dist)) {
    mkdirp.sync(newConfig.core.dist);
  }
  if (needsNewCss(newConfig, currentConfig)) {
    updateCss(newConfig, currentConfig);
  }
  const newCSSWatchList = newConfig.core.watch.css ? newConfig.core.watch.css : [];
  const oldCSSWatchList = currentConfig.core.watch.css ? currentConfig.core.watch.css : [];
  updateWatcher(newCSSWatchList, oldCSSWatchList, cssWatcher);

  if (needsNewJs(newConfig, currentConfig)) {
    updateJs(newConfig, currentConfig);
  }
  const newJSWatchList = newConfig.core.watch.scripts ? newConfig.core.watch.scripts : [];
  const oldJSWatchList = currentConfig.core.watch.scripts ? currentConfig.core.watch.scripts : [];
  updateWatcher(newJSWatchList, oldJSWatchList, jsWatcher);
  // update the config:
  currentConfig = newConfig;
};
module.exports.stopDev = () => {
  if (cssWatcher) {
    cssWatcher.close();
    cssWatcher = undefined;
  }
  if (jsWatcher) {
    jsWatcher.close();
    jsWatcher = undefined;
  }
  if (configWatcher) {
    configWatcher.close();
    configWatcher = undefined;
  }
};

let newConfig;
module.exports.runDev = (defaultConfDirectory, initialConfig, argv, log) => {
  currentConfig = initialConfig;
  cssProcessor = require('../tasks/css.js');
  jsProcessor = require('../tasks/script.js');

  // set up watcher to process config changes, trigger jss and css watchers, call stylesheet update
  let call = 0;
  watcher(initialConfig.core.watch.yaml, [], () => {
    // // first get the new updated config:
    newConfig = configHandler.loadConfig(defaultConfDirectory, argv, log);
    // // if we can't load a config, abort:
    if (!newConfig) {
      process.exit(1);
    }
    styleguide(
      newConfig,
      path.join(process.cwd(), 'lib', 'styleguide.template'),
      path.join(newConfig.core.dist, 'styleguide.html'),
      log
    );

    if (!cssWatcher) {
      // set up css watcher to process css
      cssWatcher = watcher(initialConfig.core.watch.css, initialConfig.stylesheets, (input, output) => {
        cssProcessor.runTaskAndWrite(newConfig, process.cwd(), input, output);
      }, initialConfig.core.rebuildDelay);
    }
    if (!jsWatcher) {
      // set up js watcher to process js
      const watchedJSList = initialConfig.scripts ? initialConfig.scripts : [];
      const scripts = initialConfig.core.watch.scripts ? initialConfig.core.watch.scripts : {};
      jsWatcher = watcher(scripts, watchedJSList, (input, output) => {
        jsProcessor(newConfig, process.cwd(), input, output);
      }, initialConfig.core.rebuildDelay);
    }
    onUpdateConfig(newConfig, argv, log);
  }, 100);
};
