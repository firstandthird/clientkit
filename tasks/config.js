'use strict';
const purdy = require('purdy');
const ClientKitTask = require('clientkit-task');

class ConfigTask extends ClientKitTask {
  get description() {
    return 'Prints out the config that clientkit is using';
  }

  execute(allDone) {
    purdy(this.options, {
      depth: null,
      arrayIndex: false
    });
    return allDone();
  }
}
module.exports = ConfigTask;
