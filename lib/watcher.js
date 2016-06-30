'use strict';

const chokidar = require('chokidar');
const debounce = require('lodash.debounce');

module.exports = function (watchList, taskList, processor, delay) {
  const watcher = chokidar.watch(watchList, {
    persistent: true
  });

  const files = Object.keys(taskList);

  watcher.on('all', debounce(() => {
    for (const file of files) {
      processor(file, taskList[file]);
    }
  }), delay);
};
