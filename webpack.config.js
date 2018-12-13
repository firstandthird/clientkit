const path = require('path');
const webpack = require('webpack');
const getConfig = require('./lib/getConfig');

process.env.CK_PREFIX = 'clientkit';
process.env.CK_BASE_CONFIG = path.join(__dirname, 'conf');
process.env.CK_CONFIG = path.join(__dirname, 'conf');
process.env.CK_PATH = __dirname;

const run = async function () {
  try {
    const config = await getConfig();

    webpack([config], (err, stats) => {
      if (err || stats.hasErrors()) {
        // Handle errors here
      }
      // Done processing
    });
  } catch (e) {
    process.exit(1);
  }
};

run();
