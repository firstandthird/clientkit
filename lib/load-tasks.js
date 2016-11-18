'use strict';
const RunTask = require('runtask');
const async = require('async');
module.exports = function(config, done) {
  const runner = new RunTask();

  async.mapValues(config.tasks, (task, name, next) => {
    let taskFn;
    if (Array.isArray(task)) { //task maps to other tasks
      taskFn = task;
    } else {
      const Cls = require(task);
      taskFn = new Cls(name, config[name], runner);
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
