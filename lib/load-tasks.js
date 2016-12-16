'use strict';
const RunTask = require('runtask');
const async = require('async');
module.exports = function(config, log, done) {
  const runner = new RunTask();

  async.mapValues(config.tasks, (task, name, next) => {
    let taskFn;
    if (Array.isArray(task)) { //task maps to other tasks
      taskFn = task;
    } else {
      const Cls = require(task);
      //if task is config, pass the whole thing, little bit of a hack
      const taskConfig = (name === 'config') ? config : config[name];
      taskConfig.log = log;
      taskFn = new Cls(name, taskConfig, runner);
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
