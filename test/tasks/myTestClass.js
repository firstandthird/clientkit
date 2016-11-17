'use strict';
const ClientKitTask = require('clientkit-task');

class MyTask extends ClientKitTask {
  process(output, input, processDone) {
    console.log('myTestClass has executed');
    // just returns this object for verification:
    processDone(null, this);
  }
}

module.exports = MyTask;
