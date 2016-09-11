const fs = require('fs');
const path = require('path');
module.exports.loadConfig = (defaultConf, argv, log) => {
  try {
    fs.accessSync(argv.config, fs.F_OK);
  } catch (e) {
    log(e);
    return false;
  }
  // set up configuration based on the config yamls:
  const conf = require('confi')({
    env: argv.env,
    path: [
      defaultConf,
      argv.config
    ],
    context: {
      CKDIR: path.join(__dirname, '..'),
      CONFIGDIR: argv.config
    }
  });
  return conf;
};
