'use strict';
const RunTask = require('runtask');
const _ = require('lodash');
const async = require('async');

module.exports = function(taskName, config, log, done) {
  const tasksToLoad = [taskName].concat(_.flatten(config.tasks[taskName]));
  const runner = new RunTask();
  async.each(tasksToLoad, (name, next) => {
    const task = config.tasks[name];
    let taskFn;
    if (Array.isArray(task)) { //task maps to other tasks
      taskFn = task;
    } else {
      const Cls = require(task);
      //if task is config, pass the whole thing, little bit of a hack
      const taskConfig = (config[name] && config[name].needsEntireConfig) ? config : config[name];
      taskFn = new Cls(name, taskConfig, runner, log);
    }
    runner.register(name, taskFn);
    next();
  });
  done(null, runner);
};
