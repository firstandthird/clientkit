'use strict';
const RunTask = require('runtask');
const async = require('async');
const cachedTasks = {};

module.exports = function(config, log, done) {
  const runner = new RunTask();
  // get list of all tasks:
  const taskList = Object.keys(config.tasks);
  // register all tasks with a wrapper that will lazy-load/cache it if its actually used
  async.each(taskList, (name, next) => {
    const task = config.tasks[name];
    let taskFn;
    if (Array.isArray(task)) { //task maps to other tasks
      taskFn = task;
    } else { // task is wrapped by a function that will lazy-load/cache it:
      taskFn = (callback) => {
        if (!cachedTasks[name]) {
          const Cls = require(task);
          //if task is config, pass the whole thing, little bit of a hack
          const taskConfig = (config[name] && config[name].needsEntireConfig) ? config : config[name];
          cachedTasks[name] = new Cls(name, taskConfig, runner, log);
        }
        cachedTasks[name].execute(callback);
      };
    }
    runner.register(name, taskFn);
    next();
  }, (err) => {
    if (err) {
      return done(err);
    }
    done(null, runner);
  });
};
