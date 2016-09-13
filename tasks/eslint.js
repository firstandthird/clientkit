'use strict';
const formatter = require('eslint').CLIEngine.getFormatter();
const CLIEngine = require('eslint').CLIEngine;
const Logr = require('logr');

const log = new Logr({
  type: 'cli',
  renderOptions: {
    cli: {
      lineColor: 'red'
    }
  }
});

module.exports = function(conf, base) {
  const cli = new CLIEngine({
    useEslintrc: false,
    configFile: conf.core.eslint,
    ignorePattern: conf.core.eslintIgnore
  });
  const results = cli.executeOnFiles(conf.core.watch.scripts).results;
  // if any errors, print them:
  let errorsExist = false;
  let warningsExist = false;
  results.forEach((result) => {
    if (result.errorCount > 0) {
      errorsExist = true;
    }
    if (result.warningCount > 0) {
      warningsExist = true;
    }
  });
  if (errorsExist) {
    log(['eslint', 'error'], formatter(results));
  } else if (warningsExist) {
    log(['eslint', 'warning'], formatter(results));
  }
};
