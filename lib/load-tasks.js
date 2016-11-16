const RunTask = require('runtask');
const async = require('async');
const path = require('path');
module.exports = function(config, done) {
  const runner = new RunTask();

  async.mapValues(config.tasks, (task, name, next) => {
    const Cls = require(path.resolve(process.cwd(), task));
    runner.register(name, new Cls(name, config[name], runner));
    next();
  }, (err) => {
    if (err) {
      return done(err);
    }
    done(null, runner);
  });
};
