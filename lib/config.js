'use strict';
const fs = require('fs');
const path = require('path');
const async = require('async');
const confi = require('confi');

module.exports = (clientkitConfPath, projectConfPath, env, allDone) => {
  async.auto({
    // confirm project directory exists:
    projectExists: (done) => {
      fs.exists(projectConfPath, (exists) => {
        if (!exists) {
          return allDone(`Project ${projectConfPath} does not exist!`);
        }
        done(null, exists);
      });
    },
    // load everything from the conf directory and package.json:
    directory: ['projectExists', (results, done) => {
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
          CKDIR: path.join(__dirname, '..'),
          CONFIGDIR: projectConfPath
        }
      }));
    }],
  }, (err, results) => {
    if (err) {
      return allDone(err);
    }
    // merge all the results and return:
    allDone(null, results.directory);
  });
};
