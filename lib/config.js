'use strict';
const fs = require('fs');
const path = require('path');
module.exports = (clientkitConfPath, projectConfPath, env) => {
  try {
    fs.accessSync(projectConfPath, fs.F_OK);
  } catch (e) {
    throw e;
  }
  // set up configuration based on the config yamls:
  const conf = require('confi')({
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
  });
  return conf;
};
