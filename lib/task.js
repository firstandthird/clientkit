'use strict';
const async = require('async');
const Logr = require('logr');
const path = require('path');
const fs = require('fs');

class ClientKitTask {
  constructor(name, options, runner) {
    options = options || {};
    this.name = name;
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
    const allStart = new Date().getTime();
    const filenames = Object.keys(this.options.files);
    async.map(filenames, (filename, next) => {
      const start = new Date().getTime();
      this.process(this.options.files[filename], filename, (err, results) => {
        if (err) {
          return next(err);
        }
        const end = new Date().getTime();
        const duration = (end - start) / 1000;
        this.log(`Processed ${filename} in ${duration} sec`);
        next(null, results);
      });
    }, (err, results) => {
      if (err) {
        return allDone(err);
      }
      const allEnd = new Date().getTime();
      const duration = (allEnd - allStart) / 1000;
      this.log(`Processed all ${this.name} in ${duration} sec`);
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
        self.log(['error'], err);
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
