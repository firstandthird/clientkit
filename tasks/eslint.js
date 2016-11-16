'use strict';
const formatter = require('eslint').CLIEngine.getFormatter();
const CLIEngine = require('eslint').CLIEngine;
const ClientKitTask = require('../lib/task.js');

class EslintTask extends ClientKitTask {
  execute(done) {
    if (!this.options.files) {
      return done();
    }
    const cli = new CLIEngine({
      useEslintrc: false,
      configFile: this.options.config,
      ignorePattern: this.options.ignore
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
      this.log(['eslint', 'error'], formatter(results));
    } else if (warningsExist) {
      this.log(['eslint', 'warning'], formatter(results));
    }
    return done();
  }
}
module.exports = EslintTask;
