'use strict';

const ClientKitTask = require('clientkit-task');
const Browserify = require('browserify');
const babelify = require('babelify');
const shim = require('browserify-shim');
const bes2015 = require('babel-preset-es2015');
const uglifyify = require('uglifyify');

class ScriptsTask extends ClientKitTask {
  process(input, filename, done) {
    const b = new Browserify({
      entries: [input],
      debug: true
    });

    if (this.options.shim) {
      b.transform(shim);
    }

    let currentTransform = b.transform(babelify, {
      global: this.options.globalBabel,
      presets: [bes2015],
      plugins: [],
      ignore: this.options.babelIgnore
    });

    if (this.options.minify) {
      currentTransform = currentTransform.transform(uglifyify, { global: true });
    }

    this.write(filename, currentTransform.bundle(), done);
  }
}
module.exports = ScriptsTask;
