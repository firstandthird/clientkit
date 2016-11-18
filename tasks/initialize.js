'use strict';
const async = require('async');
const ClientKitTask = require('clientkit-task');
const mkdirp = require('mkdirp');
const rmdir = require('rmdir');
const fs = require('fs');

class InitTask extends ClientKitTask {
  process(distDir, whatever, processDone) {
    async.auto({
      clearDist: (done) => {
        if (fs.existsSync(distDir)) {
          return rmdir(distDir, done);
        }
        done();
      },
      mkdist: ['clearDist', (results, done) => {
        mkdirp(distDir);
        done();
      }],
    }, processDone);
  }
}
module.exports = InitTask;
