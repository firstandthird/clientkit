const path = require('path');
const webpack = require('webpack');
const getConfig = require('./lib/get-config');

process.env.CK_PREFIX = 'default';
process.env.CK_BASE_CONFIG = path.join(__dirname, 'conf');
process.env.CK_CONFIG = path.join(__dirname, 'conf');
process.env.CK_PATH = __dirname;

const run = async () => {
  try {
    const config = await getConfig();

    webpack(config, (err, stats) => {
      if (err || stats.hasErrors()) {
        // Handle errors here
      }
      // Done processing
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

run();
