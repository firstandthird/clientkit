const fs = require('fs');

module.exports.loadConfig = (defaultConf, argv, log) => {
  try {
    fs.accessSync(argv.config, fs.F_OK);
  } catch (e) {
    log(e);
    return false;
  }
  // first set up configuration based on the config yamls:
  const conf = require('confi')({
    path: [
      defaultConf,
      argv.config
    ],
    context: {
      CKDIR: process.cwd(),
      CONFIGDIR: argv.config
    }
  });
  // second, set up the configuration based on any command line options:
  if (argv.mode === 'dev' || argv._.dev || argv._.indexOf('dev') > -1) {
    conf.mode = 'dev';
  } else {
    conf.mode = 'prod';
  }
  return conf;
};
