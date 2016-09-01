'use strict';
const mkdirp = require('mkdirp');
const watcher = require('../lib/watcher');
const configHandler = require('../lib/config.js');
const fs = require('fs');
const reduce = require('lodash.reduce');
let configWatcher = false;
let jsWatcher = false; // watcher we will use to watch js files
let cssWatcher = false; // the same, for css
let cssProcessor;
let jsProcessor;
let currentConfig;

const updateWatchedFiles = (newWatchList, oldWatchlist, watcherToUpdate) => {
  // remove any files from css watcherToUpdate that are not in newConfig
  oldWatchlist.forEach((watchDirective) => {
    if (newWatchList.indexOf(watchDirective) < 0) {
      watcherToUpdate.unwatch(watchDirective);
    }
  });
  // add any new files to css watcherToUpdate
  newWatchList.forEach((watchDirective) => {
    if (oldWatchlist.indexOf(watchDirective) < 0) {
      watcherToUpdate.add(watchDirective);
    }
  });
};

const updateCss = (newConfig, oldConfig) => {
  const newCSSWatchList = newConfig.core.watch.css ? newConfig.core.watch.css : [];
  const oldCSSWatchList = oldConfig.core.watch.css ? oldConfig.core.watch.css : [];
  updateWatchedFiles(newCSSWatchList, oldCSSWatchList, cssWatcher);
  if (newConfig.stylesheets) {
    Object.keys(newConfig.stylesheets).forEach((outputFileName) => {
      cssProcessor.runTaskAndWrite(newConfig, process.cwd(), outputFileName, newConfig.stylesheets[outputFileName]);
    });
  }
};

const updateJs = (newConfig, oldConfig) => {
  let newJSWatchList = newConfig.core.watch.scripts ? newConfig.core.watch.scripts : [];
  let oldJSWatchList = oldConfig.core.watch.scripts ? oldConfig.core.watch.scripts : [];
  const isEmpty = (list) => {
    if (!list) {
      return true;
    }
    if (list.length < 1) {
      return true;
    }
    return false;
  };
  // if we had scripts previously and don't now:
  if (!isEmpty(oldConfig.scripts) && isEmpty(newConfig.scripts)) {
    newJSWatchList = [];
  }
  // if we didn't have scripts previously and do now:
  if (isEmpty(oldConfig.scripts) && !isEmpty(newConfig.scripts)) {
    oldJSWatchList = [];
  }
  updateWatchedFiles(newJSWatchList, oldJSWatchList, jsWatcher);
  if (newConfig.scripts) {
    Object.keys(newConfig.scripts).forEach((outputFileName) => {
      jsProcessor(newConfig, process.cwd(), outputFileName, newConfig.scripts[outputFileName]);
    });
  }
};
let firstTime = true;
const onUpdateConfig = (newConfig, argv, log) => {
  if (argv.debug || argv._.indexOf('debug') > -1) {
    log(JSON.stringify(newConfig, null, '  '));
  }
  // make a new dist directory if needed:
  if (currentConfig.core.dist !== newConfig.core.dist || !fs.existsSync(newConfig.core.dist)) {
    mkdirp.sync(newConfig.core.dist);
  }
  if (!firstTime) {
    updateCss(newConfig, currentConfig);
    updateJs(newConfig, currentConfig);
  } else {
    firstTime = false;
  }
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
  configWatcher = watcher(initialConfig.core.watch.yaml, [], () => {
    // // first get the new updated config:
    newConfig = configHandler.loadConfig(defaultConfDirectory, argv, log);
    // // if we can't load a config, abort:
    if (!newConfig) {
      process.exit(1);
    }
    if (!cssWatcher) {
      // set up css watcher to process css
      cssWatcher = watcher(newConfig.core.watch.css, newConfig.stylesheets, (input, output) => {
        if (output === '') {
          return;
        }
        cssProcessor.runTaskAndWrite(newConfig, process.cwd(), input, output);
      }, initialConfig.core.rebuildDelay);
    }
    if (!jsWatcher) {
      // set up js watcher to process js
      const watchedJSList = newConfig.scripts ? newConfig.scripts : [];
      const scripts = newConfig.core.watch.scripts ? newConfig.core.watch.scripts : {};
      jsWatcher = watcher(scripts, watchedJSList, (input, output) => {
        if (output === '') {
          return;
        }
        jsProcessor(newConfig, process.cwd(), input, output);
      }, newConfig.core.rebuildDelay);
    }
    onUpdateConfig(newConfig, argv, log);
    if (argv.debug || argv._.indexOf('debug') > -1) {
      setTimeout(() => {
        const jsFiles = reduce(jsWatcher.getWatched(), (memo, fileList) => { return memo + fileList.length; }, 0);
        const cssFiles = reduce(cssWatcher.getWatched(), (memo, fileList) => { return memo + fileList.length; }, 0);
        const configFiles = reduce(configWatcher.getWatched(), (memo, fileList) => { return memo + fileList.length; }, 0);
        log(`Watching ${jsFiles} JS files, ${cssFiles} CSS files, ${configFiles} config files `);
      }, 2000);
    }
  }, 100);
};
