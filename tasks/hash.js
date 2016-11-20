'use strict';
const async = require('async');
const ClientKitTask = require('clientkit-task');
const glob = require('glob');
const hash = require('rev-hash');
const path = require('path');
const fs = require('fs');

class HashTask extends ClientKitTask {

  constructor(name, config, runner) {
    super(name, config, runner);
    // map of original filename to its hashed equivalent, useful for url hashing:
    this.map = {};
  }

  get description() {
    return 'Hashes your file names (based on their content) and prints a route-map for the original file. Useful for updating browser caches when a file gets updated';
  }

  // save the filename:hashname map to file:
  onFinish(results, done) {
    this.writeMap(done);
  }
  execute(allDone) {
    this.clearMap();
    super.execute(allDone);
  }

  process(input, filename, processDone) {
    async.auto({
      fileNames: (done) => {
        // get the list of matching files
        glob(input, {}, done);
      },
      fileContents: ['fileNames', (results, done) => {
        const seriesResult = {};
        async.eachSeries(results.fileNames, (fileName, eachDone) => {
          if (!fileName) {
            return eachDone();
          }
          fs.readFile(fileName, (err, data) => {
            if (err) {
              return eachDone(err);
            }
            seriesResult[fileName] = data;
            eachDone();
          });
        }, (err) => {
          done(err, seriesResult);
        });
      }],
      fileHashes: ['fileContents', (results, done) => {
        const hashResults = {};
        Object.keys(results.fileContents).forEach((fileName) => {
          const hashName = this.hasher(fileName, results.fileContents[fileName]);
          hashResults[fileName] = hashName;
        });
        done(null, hashResults);
      }],
      renameFiles: ['fileHashes', (results, done) => {
        async.eachSeries(Object.keys(results.fileHashes), (fileName, eachDone) => {
          fs.rename(fileName, results.fileHashes[fileName], eachDone);
        }, done);
      }]
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

  // write the url hash map
  writeMap(done) {
    this.write(this.options.mappingFile, JSON.stringify(this.map), done);
  }

  // clear the url hash map:
  clearMap() {
    this.map = {};
  }
}
module.exports = HashTask;
