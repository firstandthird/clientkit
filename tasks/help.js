'use strict';
const ClientKitTask = require('clientkit-task');
const Logr = require('logr');
class HelpTask extends ClientKitTask {

  constructor(name, config, runner) {
    config.log = new Logr({
      type: 'cli',
      renderOptions: {
        cli: {
          prefix: 'Clientkit Help Plugin:',
          prefixColor: 'white',
          lineColor: 'green'
        }
      }
    });
    super(name, config, runner);
    this.calledOnce = false;
  }

  process(input, filename, processDone) {
    if (this.calledOnce) {
      return processDone();
    }
    this.calledOnce = true;
    this.printAll();
    return processDone();
  }

  printAll() {
    if (!this.options.active) {
      return;
    }
    this.log('-----    Clientkit Help Display ------');
    this.log('(set help.active to "false" to hide this info )')
    this.log('Registered tasks: ');
    Object.keys(this.runner.tasks).forEach((taskName) => {
      const task = this.runner.tasks[taskName];
      if (task.options) {
        this.log(`  "${task.name}": ${task.options.description}`);
      }
    });
    this.log('Named Task Sets:')
    Object.keys(this.runner.tasks).forEach((taskName) => {
      const task = this.runner.tasks[taskName];
      if (!task.forEach) {
        return;
      }
      this.log(`  Task Set "${taskName}" has the following sub-tasks:`);
      this.printTaskList(task, 0);
      this.log(''); // <-- blank line for clarity
    });
    this.log('----- Exit Clientkit Help Display ------');
  }
  printTaskList(taskList, level) {
    let buffer = '    ';
    for (let i = 0; i < level; i++) {
      buffer = `  ${buffer}`;
    }
    if (!taskList.forEach) {
      this.log(`${buffer} - ${taskList}`);
    } else {
      taskList.forEach((subtask) => {
        this.printTaskList(subtask, level + 1);
      });
    }
  }
}
module.exports = HelpTask;
