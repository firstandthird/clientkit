'use strict';
const mkdirp = require('mkdirp');
const async = require('async');

module.exports.runAll = (config) => {
  const cssProcessor = require('../tasks/css.js');
  const jsProcessor = require('../tasks/script.js');
  const lintProcessor = require('../tasks/eslint.js');
  // Tasks
  mkdirp.sync(config.core.dist);
  const stylesheets = config.stylesheets ? Object.keys(config.stylesheets) : [];
  const scripts = config.scripts ? Object.keys(config.scripts) : [];
  const allTasks = scripts.concat(stylesheets);
  // loop over all tasks:
  const executeTask = (taskName, done) => {
    if (stylesheets.indexOf(taskName) > -1) {
      cssProcessor.runTaskAndWrite(config, process.cwd(), taskName, config.stylesheets[taskName], done);
    } else if (scripts.indexOf(taskName) > -1) {
      jsProcessor(config, process.cwd(), taskName, config.scripts[taskName], done);
    }
  };
  // will short circuit if any task fails:
  async.eachSeries(allTasks, executeTask, (err) => {
    if (err) {
      console.log(err);
      // todo: log the error using logr?
      return;
    }
    // lint process will short-circuit if there's an error:
    if (!lintProcessor(config, process.cwd())) {
      return;
    }
  });
};
