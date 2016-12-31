'use strict';

const ClientKitTask = require('clientkit-task');
const configLoader = require('clientkit-core/lib/config');

class ReloadConfigTask extends ClientKitTask {
  get description() {
    return 'Reload your project config files when changes are made to them';
  }

  execute(allDone) {
    // does not run on first load
    if (!this.hasInit) {
      this.hasInit = true;
      return allDone();
    }
    configLoader(this.options.clientkitConfPath, this.options.projectConfPath, this.options.env, (err, updateConfig) => {
      if (err) {
        this.log(err);
      }
      Object.keys(this.runner.tasks).forEach((taskName) => {
        const task = this.runner.tasks[taskName];
        if (task instanceof ClientKitTask) {
          const taskConfig = (updateConfig[taskName] && updateConfig[taskName].needsEntireConfig) ? updateConfig : updateConfig[taskName];
          task.updateOptions(taskConfig);
        }
      });
      this.runner.run(this.options.taskOnUpdate, allDone);
    });
  }
}
module.exports = ReloadConfigTask;
