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

module.exports = function (watchList, taskList, processor, delay) {
  if (!taskList) {
    return false;
  }

  const watcher = chokidar.watch(watchList, {
    persistent: true,
    ignored: /node_modules|dist/
  });

  const files = Object.keys(taskList);

  watcher.on('all', (event, path) => {
    log(`Changed: ${path}`);
  });
  watcher.on('all', debounce(() => {
    for (const file of files) {
      processor(file, taskList[file]);
    }
  }), delay);
  return watcher;
};
