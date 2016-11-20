'use strict';

const ClientKitTask = require('clientkit-task');
const loadConfig = require('../lib/config');

class ReloadConfigTask extends ClientKitTask {
  get description() {
    return 'Reload your project config files when changes are made to them';
  }

  execute(allDone) {
    //runs on first load, skip that one
    if (!this.hasInit) {
      this.hasInit = true;
      return allDone();
    }
    const updateConfig = loadConfig(this.options.clientkitConfPath, this.options.projectConfPath, this.options.env);
    Object.keys(this.runner.tasks).forEach((taskName) => {
      const task = this.runner.tasks[taskName];
      if (task instanceof ClientKitTask) {
        task.updateOptions(updateConfig[taskName]);
      }
    });
    this.runner.run(this.options.taskOnUpdate);
    this.log('Updated config');
    allDone();
  }
}
module.exports = ReloadConfigTask;
