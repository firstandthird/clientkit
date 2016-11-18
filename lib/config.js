'use strict';
const fs = require('fs');
const path = require('path');
const async = require('async');
const confi = require('confi');
const _ = require('lodash');

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
          projectConfPath
        ],
        context: {
          CKDIR: path.join(__dirname, '..'),
          CONFIGDIR: projectConfPath
        }
      }));
    }],
    // load everything from the clientkit.yaml if that exists:
    configFile: ['projectExists', (results, done) => {
      const configFilePath = path.join(projectConfPath, 'clientkit.yaml');
      fs.exists(configFilePath, (configFileExists) => {
        if (configFileExists) {
          // parse that yaml:
          return done(null, confi({
            path: projectConfPath,
            env: 'clientkit',
            context: {
              CKDIR: path.join(__dirname, '..'),
              CONFIGDIR: projectConfPath
            }
          }));
        }
        done(null, {});
      });
    }]
  }, (err, results) => {
    if (err) {
      return allDone(err);
    }
    // merge all the results and return:
    const config = _.defaults(results.configFile, results.directory);
    allDone(null, config);
  });
};
