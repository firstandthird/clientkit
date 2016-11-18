'use strict';
const async = require('async');
const ClientKitTask = require('clientkit-task');
const glob = require('glob');
const hash = require('rev-hash');
const path = require('path');
const fs = require('fs');
const debounce = require('lodash.debounce');

class HashTask extends ClientKitTask {

  constructor(name, config, runner) {
    super(name, config, runner);
    // map of original filename to its hashed equivalent, useful for url hashing:
    this.map = {};
  }

  // hash the files, then save the filename:hashname map to file:
  execute(allDone) {
    this.clearMap();
    super.execute((err, result) => {
      if (err) {
        return allDone(err);
      }
      this.writeMap();
      return allDone(null, result);
    });
  }

  process(input, filename, processDone) {
    async.auto({
      filesToHash: (done) => {
        // get the list of matching files
        glob(input, {}, done);
      },
      hashNames: ['filesToHash', (results, done) => {
        const hashMap = {};
        results.filesToHash.forEach((file) => {
          const hashName = this.hasher(file, fs.readFileSync(file));
          this.map[file] = hashName;
          fs.renameSync(file, hashName);
        });
        done(null, hashMap);
      }],
    }, processDone);
  }

  hasher(inputName, inputContent) {
    let hashKey;
    if (typeof inputContent === 'string') {
      hashKey = hash(Buffer.from(inputContent));
    } else {
      hashKey = hash(inputContent);
    }
    const extension = path.extname(inputName);
    const basename = path.basename(inputName);
    const outputName = inputName.replace(extension, `.${hashKey}${extension}`);
    const baseOutput = basename.replace(extension, `.${hashKey}${extension}`);
    this.map[basename] = baseOutput;
    return outputName;
  }

  // write the url hash map, only once every debounce seconds:
  writeMap() {
    debounce(() => {
      fs.writeFileSync(this.options.urlHashing.jsonMapping, JSON.stringify(this.map));
    }, this.options.delay)();
  }

  // clear the url hash map:
  clearMap() {
    this.map = {};
  }
}
module.exports = HashTask;
