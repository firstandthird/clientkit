'use strict';
const async = require('async');
const ClientKitTask = require('clientkit-task');
const mkdirp = require('mkdirp');
const rmdir = require('rmdir');

class InitTask extends ClientKitTask {
  process(distDir, whatever, processDone) {
    async.auto({
      clearDist: (done) => {
        rmdir(distDir, done);
      },
      mkdist: ['clearDist', (results, done) => {
        mkdirp(distDir);
        done();
      }],
    }, () => {
      return processDone();
    });
  }
}
module.exports = InitTask;
