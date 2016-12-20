'use strict';
const ClientKitTask = require('clientkit-task');

class HelpTask extends ClientKitTask {
  get description() {
    return 'Prints various help info about your tasks';
  }

  // prints out a hierarchical set of tasks:
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

  execute(allDone) {
    this.log(`-----    Clientkit Version ${require('../package.json').version} Help Display ------`);
    this.log('(set help.enabled to "false" to hide this info )');
    this.log('Registered tasks: ');
    Object.keys(this.runner.tasks).forEach((taskName) => {
      const task = this.runner.tasks[taskName];
      if (task.options) {
        this.log(`  "${task.name}": ${task.description}`);
      }
    });
    this.log('Named Task Sets:');
    Object.keys(this.runner.tasks).forEach((taskName) => {
      const task = this.runner.tasks[taskName];
      if (!task.forEach) {
        return;
      }
      this.log(`  Task Set "${taskName}" has the following sub-tasks:`);
      this.printTaskList(task, 0);
      this.log(''); // <-- blank line for clarity
    });
    this.log('----- End Clientkit Help Display ------');
    return allDone();
  }
}
module.exports = HelpTask;
