'use strict';

const fs = require('fs');
const path = require('path');
const Browserify = require('browserify');
const babelify = require('babelify');

const bes2015 = require('babel-preset-es2015');
const protoAssign = require('babel-plugin-transform-object-set-prototype-of-to-assign');


module.exports = function(conf, base, outputName, input) {
  const output = path.join(conf.CWD, '.dist', outputName);

  const fileStream = fs.createWriteStream(output);
  fileStream.on('finish', () => {
    console.log(`Processed: ${input} → ${output}`);
  });

  const b = new Browserify({
    entries: [input]
  });

  b
    .transform(babelify, { global: true, presets: [bes2015], plugins: [protoAssign] })
    .bundle()
    .pipe(fileStream);
};
