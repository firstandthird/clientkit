'use strict';

const fs = require('fs');
const path = require('path');
const Browserify = require('browserify');
const babelify = require('babelify');
const exorcist = require('exorcist');
const formatter = require('eslint').CLIEngine.getFormatter();
const CLIEngine = require('eslint').CLIEngine;
const bes2015 = require('babel-preset-es2015');
const uglifyify = require('uglifyify');
const hashing = require('../lib/urlHashes');
const Logr = require('logr');

const log = new Logr({
  type: 'cli',
  renderOptions: {
    cli: {
      lineColor: 'blue'
    }
  }
});

module.exports = function(conf, base, outputName, input) {
  const start = new Date().getTime();
  let output = path.join(conf.core.dist, outputName);

  const fileStream = fs.createWriteStream(output);
  fileStream.on('finish', () => {
    if (conf.core.urlHashing.active) {
      const newOutput = hashing.hash(output, fs.readFileSync(output));
      fs.renameSync(output, newOutput);
      output = newOutput;
      hashing.writeMap(conf);
    }
    const end = new Date().getTime();
    const duration = (end - start) / 1000;
    log(`Processed: ${input} → ${output} in ${duration} sec`);
  });
  const cli = new CLIEngine({
    useEslintrc: false,
    configFile: conf.core.eslint
  });
  const results = cli.executeOnFiles([input]).results;
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

  const b = new Browserify({
    entries: [input],
    debug: true
  });

  let currentTransform = b.transform(babelify, { global: conf.core.globalBabel, presets: [bes2015], plugins: [] });
  if (conf.core.minify) {
    currentTransform = currentTransform.transform(uglifyify, { global: true });
  }
  currentTransform
  .bundle()
  .on('error', function (err) {
    log(['error'], err);
    this.emit('end');
  })
  .pipe(exorcist(`${output}.map`))
  .pipe(fileStream);
};
