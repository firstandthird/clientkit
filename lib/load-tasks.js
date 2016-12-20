'use strict';
const RunTask = require('runtask');
const async = require('async');
const path = require('path');
module.exports = function(config, log, done) {
  const runner = new RunTask();

  async.mapValues(config.tasks, (task, name, next) => {
    let taskFn;
    if (Array.isArray(task)) { //task maps to other tasks
      taskFn = task;
    } else {
      let Cls = false;
      // try to load task by its given name:
      try {
        Cls = require(task);
      } catch (e) {}
      // if that failed then try to resolve the path name for the task:
      if (!Cls) {
        try {
          Cls = require(path.resolve(task));
        } catch (e) {}
      }
      // if no task was ever found, report that problem.
      if (!Cls) {
        return next(new Error(`Unable to import task ${task} `));
      }
      //if task is config, pass the whole thing, little bit of a hack
      const taskConfig = (config[name] && config[name].needsEntireConfig) ? config : config[name];
      taskFn = new Cls(name, taskConfig, runner, log);
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
