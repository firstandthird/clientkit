'use strict';
const TaskKitTask = require('taskkit-task');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

class UpdateTask extends TaskKitTask {
  get description() {
    return 'Checks to see if an updated version of Clientkit exists';
  }

  execute(done) {
    // notify if a more-recent clientkit is available:
    const result = updateNotifier({ pkg }).notify();
    if (result.update && result.update.latest !== result.update.current) {
      this.log(['warning'], `A new version of clientkit is available on npm! Current: ${result.update.current}  Latest: ${result.update.latest}`);
    }
    done();
  }
}
module.exports = UpdateTask;
