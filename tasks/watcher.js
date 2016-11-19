'use strict';

const ClientKitTask = require('clientkit-task');
const chokidar = require('chokidar');
const debounce = require('lodash.debounce');
const pathLib = require('path');

class WatcherTask extends ClientKitTask {
  constructor(name, config, runner) {
    super(name, config, runner);
    this.description = 'In dev mode, this task will recompile your whole project when you make changes to the indicated files ';
  }
  process(tasks, watch, done) {
    const ignored = new RegExp(this.options.ignore.join('|'));
    this.log(['info'], `Watcher: Ignoring: ${ignored}`);
    this.watcher = chokidar.watch(watch, {
      ignored,
      awaitWriteFinish: true
    });

    this.watcher.on('all', (event, path) => {
      this.log(`Changed: ${pathLib.relative(process.cwd(), path)}`);
    });
    if (this.options.debug) {
      this.watcher.on('ready', () => {
        const watchedPaths = this.watcher.getWatched();
        this.log(['info'], 'Listing watched paths...');
        this.log(['info'], watchedPaths);
      });
    }
    this.watcher.on('error', (error) => {
      this.log(['error'], error);
    });
    this.watcher.on('all', debounce(() => {
      this.log(`Running: ${tasks}`);
      this.runner.run(tasks);
    }, this.options.delay));

    done();
  }

  onFinish() {
    //don't call done so the process stays open
  }
}
module.exports = WatcherTask;
