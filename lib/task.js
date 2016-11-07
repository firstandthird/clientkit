const async = require('async');
const Logr = require('logr');
const path = require('path');
const fs = require('fs');

class ClientKitTask {
  constructor(options) {
    options = options || {};
    this.options = options;
    this.log = new Logr({
      type: 'cli',
      renderOptions: {
        cli: {
          lineColor: options.logColor || 'cyan'
        }
      }
    });
  }

  execute(allDone) {
    const filenames = Object.keys(this.options.files);
    async.each(filenames, (filename, next) => {
      async.auto({
        process: (done) => {
          this.process(this.options.files[filename], filename, done);
        },
        write: ['process', (results, done) => {
          this.write(filename, results.process, done);
        }]
      }, next);
    }, allDone);
  }

  process(file, done) {
    done();
  }

  write(filename, contents, done) {
    if (!contents) {
      this.log(['clientkit', 'css', 'warning'], `attempting to write empty string to ${filename}`);
    }
    const output = path.join(this.options.core.dist, filename);
    this.log(['info'], `Writing file ${output}`);
    fs.writeFile(output, contents, done);
  }
}

module.exports = ClientKitTask;
