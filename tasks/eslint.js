'use strict';
const formatter = require('eslint').CLIEngine.getFormatter();
const CLIEngine = require('eslint').CLIEngine;
const Logr = require('logr');
const ClientKitTask = require('../lib/task.js');

const log = new Logr({
  type: 'cli',
  renderOptions: {
    cli: {
      lineColor: 'red'
    }
  }
});
class EslintTask extends ClientKitTask {
  execute(done) {
    if (!this.options.files) {
      return done();
    }
    const cli = new CLIEngine({
      useEslintrc: false,
      configFile: this.options.eslint,
      ignorePattern: this.options.eslintIgnore
    });

    const results = cli.executeOnFiles(this.options.files).results;
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
    return done();
  }
}
module.exports = EslintTask;
