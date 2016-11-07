const RunTask = require('runtask');
const async = require('async');
const path = require('path');
module.exports = function(config, done) {
  const runner = new RunTask();

  async.mapValues(config.tasks, (task, name, next) => {
    const Cls = require(path.resolve(process.cwd(), task.register));
    runner.register(name, new Cls(task.options, runner));
    next();
  }, (err) => {
    if (err) {
      return done(err);
    }
    done(null, runner);
  });
};
