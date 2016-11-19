'use strict';
const async = require('async');
const ClientKitTask = require('clientkit-task');
const mkdirp = require('mkdirp');
const rmdir = require('rmdir');
const fs = require('fs');

class InitTask extends ClientKitTask {
  constructor(name, config, runner) {
    super(name, config, runner);
    this.description = 'Initializes the output directory so that everything will be available';
  }

  process(distDir, whatever, processDone) {
    async.auto({
      exists: (done) => {
        fs.exists(distDir, (exists) => done(null, exists));
      },
      clearDist: ['exists', (results, done) => {
        if (results.exists) {
          return rmdir(distDir, done);
        }
        done();
      }],
      mkdist: ['clearDist', (results, done) => {
        mkdirp(distDir, done);
      }],
    }, processDone);
  }
}
module.exports = InitTask;
