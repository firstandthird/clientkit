'use strict';

const ClientKitTask = require('../lib/task');
const chokidar = require('chokidar');
const debounce = require('lodash.debounce');
const pathLib = require('path');
const async = require('async');

class WatcherTask extends ClientKitTask {
  //TODO: remove when base is cleaned up
  execute(allDone) {
    if (!this.options.files) {
      return allDone();
    }
    const filenames = Object.keys(this.options.files);
    async.each(filenames, (filename, next) => {
      this.process(this.options.files[filename], filename, next);
    }, allDone);
  }

  process(tasks, watch, done) {
    this.watcher = chokidar.watch(watch, {
      ignored: /node_modules|dist/,
      awaitWriteFinish: true
    });

    this.watcher.on('all', (event, path) => {
      this.log(`Changed: ${pathLib.relative(process.cwd(), path)}`);
    });
    this.watcher.on('error', (error) => {
      this.log(['error'], error);
    });
    this.watcher.on('all', debounce(() => {
      this.options.runner.run(tasks);
    }, this.options.delay));
    done();
  }

  onFinish() {
    //don't call done so the process stays open
  }
}
module.exports = WatcherTask;
