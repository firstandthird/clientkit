'use strict';
const async = require('async');
const ClientKitTask = require('clientkit-task');
const glob = require('glob');
const hasher = require('../lib/urlHashes.js');
const fs = require('fs');

class HashTask extends ClientKitTask {
  process(input, filename, processDone) {
    async.auto({
      filesToHash: (done) => {
        // get the list of matching files
        glob(input, {}, done);
      },
      hashNames: ['filesToHash', (results, done) => {
        const hashMap = {};
        results.filesToHash.forEach((file) => {
          fs.renameSync(file, hasher.hash(file, fs.readFileSync(file)));
        });
        done(null, hashMap);
      }],
    }, processDone);
  }
}
module.exports = HashTask;
