'use strict';

const chokidar = require('chokidar');
const debounce = require('lodash.debounce');
const Logr = require('logr');
const pathLib = require('path');
const log = new Logr({
  type: 'cli',
  renderOptions: {
    cli: {
      lineColor: 'yellow'
    }
  }
});
module.exports = function (watchList, taskList, processor, delay) {
  if (!taskList) {
    return false;
  }
  const watcher = chokidar.watch(watchList, {
    ignored: /node_modules|dist/,
    awaitWriteFinish: true
  });

  const files = Object.keys(taskList);
  watcher.on('all', (event, path) => {
    log(`Changed: ${pathLib.relative(process.cwd(), path)}`);
  });
  watcher.on('error', (error) => {
    log(['error'], error);
  });
  // the css/script watchers have lists of
  // input -> output files that must be
  // individually processed:
  if (Object.keys(taskList).length > 0) {
    watcher.on('all', debounce(() => {
      for (const file of files) {
        processor(file, taskList[file]);
      }
    }, delay));
  // the config watcher doesn't have a list of
  // input -> output files to process. it
  // wil only run processor one time:
  } else {
    watcher.on('all', debounce(() => {
      processor('', '');
    }), delay);
  }
  return watcher;
};
