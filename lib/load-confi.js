const confi = require('confi');
const paths = require('../paths');

const env = process.env.NODE_ENV || 'development';

const loadConfi = () => {
  const configPaths = [];

  if (paths.baseConfig) {
    configPaths.push(paths.baseConfig);
  }

  configPaths.push(paths.primaryConfig);
  configPaths.push({
    env,
    path: process.cwd(),
    prefix: paths.prefix
  });

  try {
    return confi({
      path: configPaths,
      package: {
        key: paths.prefix
      },
      context: {
        CONFIGDIR: paths.primaryConfig
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = loadConfi;
