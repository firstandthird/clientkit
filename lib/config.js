'use strict';
const async = require('async');
const confi = require('confi');
const path = require('path');

module.exports = (clientkitConfPath, projectConfPath, env, allDone) => {
  async.auto({
    // load everything from the conf directory, package.json, and clientkit.yaml:
    directory: (done) => {
      done(null, confi({
        env,
        package: true,
        path: [
          clientkitConfPath,
          projectConfPath,
          // will try to load the 'clientkit.yaml' from the project dir:
          {
            env: 'default',
            path: projectConfPath,
            prefix: 'clientkit'
          }
        ],
        context: {
          CKDIR: path.relative(process.cwd(), '..'),
          CONFIGDIR: projectConfPath
        }
      }));
    },
  }, (err, results) => {
    if (err) {
      return allDone(err);
    }
    allDone(null, results.directory);
  });
};
