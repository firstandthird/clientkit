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
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.errorCount > 0) {
      log(['eslint', 'error'], formatter(results));
      return;
    }
    if (result.warningCount > 0) {
      log(['eslint', 'warning'], formatter(results));
      return;
    }
  }
};
