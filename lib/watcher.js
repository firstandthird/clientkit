'use strict';

const chokidar = require('chokidar');
const debounce = require('lodash.debounce');
const Logr = require('logr');
const log = new Logr({
  type: 'cli',
  renderOptions: {
    cli: {
      lineColor: 'yellow'
    }
  }
});
let watcherCount = 0;
module.exports = function (watchList, taskList, processor, delay) {
  watcherCount ++;
  if (!taskList) {
    return false;
  }
  const watcher = chokidar.watch(watchList, {
    persistent: true,
    ignored: /node_modules|dist/,
    awaitWriteFinish: true
  });

  const files = Object.keys(taskList);
  watcher.on('all', (event, path) => {
    log(`Changed: ${path}`);
  });
  if (Object.keys(taskList).length > 0) {
    watcher.on('all', debounce(() => {
      for (const file of files) {
        processor(file, taskList[file]);
      }
    }), delay);
  } else {
    watcher.on('all', debounce(() => {
      processor('', '');
    }), delay);
  }
  return watcher;
};
