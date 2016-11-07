const async = require('async');
const Logr = require('logr');
const path = require('path');
const fs = require('fs');

class ClientKitTask {
  constructor(options, runner) {
    options = options || {};
    this.options = options;
    this.runner = runner;
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
    if (!this.options.files) {
      return allDone();
    }
    const filenames = Object.keys(this.options.files);
    async.map(filenames, (filename, next) => {
      this.process(this.options.files[filename], filename, next);
    }, (err, results) => {
      if (err) {
        return allDone(err);
      }
      this.onFinish(results, allDone);
    });
  }

  onFinish(results, done) {
    done(null, results);
  }

  process(file, done) {
    done();
  }

  write(filename, contents, done) {
    if (!contents) {
      this.log(['clientkit', 'warning'], `attempting to write empty string to ${filename}`);
    }
    const output = path.join(this.options.dist, filename);
    this.log(['info'], `Writing file ${output}`);
    //TODO: better check of stream
    if (typeof contents === 'string') {
      fs.writeFile(output, contents, done);
    } else {
      const fileStream = fs.createWriteStream(output);
      const self = this;
      contents.on('error', function (err) {
        self(['error'], err);
        this.emit('end');
      });
      fileStream.on('finish', () => {
        done();
      });
      contents.pipe(fileStream);
    }
  }
}

module.exports = ClientKitTask;
