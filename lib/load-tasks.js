'use strict';
const RunTask = require('runtask');
const async = require('async');
module.exports = function(config, log, allDone) {
  const runner = new RunTask();

  // for each task, try to register it
  // if unable to do so, log the error and substitute in a placeholder task:
  async.mapValues(config.tasks, (task, name, next) => {
    let taskFn;
    if (Array.isArray(task)) { //task maps to other tasks
      taskFn = task;
    } else {
      try {
        const Cls = require(task);
        config[name].log = log;
        taskFn = new Cls(name, config[name], runner);
      } catch (e) {
        log(['clientkit', 'error'], e);
        taskFn = (taskDone) => {
          log(['clientkit'], `(module ${name} was not available at ${task})`);
          return taskDone();
        };
      }
    }
    runner.register(name, taskFn);
    return next();
  }, () => {
    allDone(null, runner);
  });
};
