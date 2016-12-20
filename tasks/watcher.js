'use strict';

const ClientKitTask = require('clientkit-task');
const chokidar = require('chokidar');
const debounce = require('lodash.debounce');
const pathLib = require('path');
class WatcherTask extends ClientKitTask {

  get description() {
    return 'This task watches the indicated files for changes, and re-runs the other registered ClientKitTasks when an edit is made to them.';
  }

  process(tasks, watch, done) {
    // add together the top-level watcher 'ignore' expressions with this watch's specific 'ignore' expressions:
    let ignoreString = this.options.ignore.join('|');
    const ignored = new RegExp(ignoreString);
    const taskToRun = (typeof tasks === 'object' && tasks.task) ? tasks.task : tasks;
    this.log(`Watching: ${watch}, Ignoring: ${ignored}, Task: ${taskToRun}`);
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
        this.log(['debug'], 'Listing watched paths...');
        this.log(['debug'], watchedPaths);
      });
    }
    this.watcher.on('error', (error) => {
      this.log(['error'], error);
    });
    this.watcher.on('all', debounce(() => {
      this.log(`Running: ${taskToRun}`);
      this.runner.run(taskToRun, (err) => {
        if (err) {
          this.log(err);
        }
      });
    }, this.options.delay));
    done();
  }

  onFinish() {
    //don't call done so the process stays open
  }
}
module.exports = WatcherTask;
