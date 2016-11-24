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
  let warnings = 0;
  let errors = 0;
  // if any errors, print them:
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.errorCount > 0) {
      if (conf.core.haltOn.eslint) {
        log(['eslint', 'error'], formatter([result]));
        return false;
      }
      errors++;
    }
    if (result.warningCount > 0) {
      warnings++;
    }
  }
  if (errors > 0) {
    log(['eslint', 'warning'], formatter(results));
  } else if (warnings > 0) {
    log(['eslint', 'error'], formatter(results));
  }
  return true;
};
