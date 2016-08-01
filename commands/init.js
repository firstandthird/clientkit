'use strict';
const mkdirp = require('mkdirp');
const path = require('path');
const Logr = require('logr');
const fs = require('fs');
const log = new Logr({
  type: 'cli',
  renderOptions: {
    cli: {
      lineColor: 'cyan'
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
  const mainConfigFiles = fs.readdirSync('conf/');
  mainConfigFiles.forEach((fileName) => {
    try {
      fs.writeFileSync(path.join(initDir, fileName), fs.readFileSync(path.join('./conf', fileName)));
    } catch (e) {
      log(e);
      return false;
    }
  });
  return true;
};
