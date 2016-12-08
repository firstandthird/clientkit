'use strict';

const ClientKitTask = require('clientkit-task');
const Browserify = require('browserify');
const babelify = require('babelify');
const shim = require('browserify-shim');
const bes2015 = require('babel-preset-es2015');
const uglifyify = require('uglifyify');
const exorcist = require('exorcist');
const path = require('path');
class ScriptsTask extends ClientKitTask {

  get description() {
    return 'Compiles your various client-executable files into a minified, source-mapped, browser-compatible js file that you can embed in a webpage';
  }

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
    const result = currentTransform.bundle();
    // sourcemaps must be explicitly false to disable:
    if (this.options.sourcemap !== false) {
      result.pipe(exorcist(`${path.join(this.options.dist, filename)}.map`));
      return this.write(filename, result, done);
    }
    return this.write(filename, result, done);
  }
}
module.exports = ScriptsTask;
