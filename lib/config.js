'use strict';
const fs = require('fs');
const path = require('path');
const confi = require('confi');
module.exports = (clientkitConfPath, projectConfPath, env) => {
  try {
    fs.accessSync(projectConfPath, fs.F_OK);
  } catch (e) {
    throw e;
  }
  // set up configuration based on the config yamls:
  const conf = confi({
    env,
    path: [
      path.join(clientkitConfPath, 'conf'),
      projectConfPath
    ],
    context: {
      CKDIR: path.join(__dirname, '..'),
      CONFIGDIR: projectConfPath
    }
  });
  return conf;
};
