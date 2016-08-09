'use strict';
const mkdirp = require('mkdirp');
const path = require('path');
const Logr = require('logr');
const fs = require('fs');
const log = new Logr({
  type: 'cli',
  renderOptions: {
    cli: {
      lineColor: 'yellow'
    }
  }
});

module.exports = (argv) => {
  let initDir = argv.init ? argv.init : argv._.init;
  // default project dir is clientkit
  if (initDir === '' || initDir === undefined) {
    initDir = path.join(process.cwd(), 'clientkit');
  }
  log(`initializing new project directory ${initDir}`);
  try {
    mkdirp.sync(initDir);
  } catch (e) {
    log(e);
    return false;
  }
  const defaultConfigurationPath = path.join(__dirname, '..', 'conf/');
  const mainConfigFiles = fs.readdirSync(defaultConfigurationPath);
  mainConfigFiles.forEach((fileName) => {
    try {
      fs.writeFileSync(path.join(initDir, fileName), fs.readFileSync(path.join(defaultConfigurationPath, fileName)));
    } catch (e) {
      log(e);
      return false;
    }
  });
  return true;
};
