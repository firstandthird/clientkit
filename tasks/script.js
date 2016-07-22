'use strict';

const fs = require('fs');
const path = require('path');
const Browserify = require('browserify');
const babelify = require('babelify');
const exorcist = require('exorcist');
const formatter = require('eslint').CLIEngine.getFormatter();
const CLIEngine = require('eslint').CLIEngine;
const bes2015 = require('babel-preset-es2015');
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
  const output = path.join(conf.core.dist, outputName);

  const fileStream = fs.createWriteStream(output);
  fileStream.on('finish', () => {
    const end = new Date().getTime();
    const duration = (end - start) / 1000;
    log(`Processed: ${input} → ${output} in ${duration} sec`);
  });
  const cli = new CLIEngine({
    useEslintrc: false,
    configFile: conf.core.eslint
  });
  log(formatter(cli.executeOnFiles([input]).results));

  const b = new Browserify({
    entries: [input],
    debug: true
  });

  b
    .transform(babelify, { global: true, presets: [bes2015], plugins: [] })
    .bundle()
    .on('error', function (err) {
      log(['error'], err.stack);
      this.emit('end');
    })
    .pipe(exorcist(`${output}.map`))
    .pipe(fileStream);
};
