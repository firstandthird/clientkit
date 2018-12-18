#!/usr/bin/env node
/* eslint-disable no-console */
const path = require('path');
const getConfig = require('./webpack/get-config');
const webpack = require('webpack');

process.env.CK_PREFIX = 'clientkit';
process.env.CK_BASE_CONFIG = path.join(__dirname, 'conf');
process.env.CK_CONFIG = path.join(__dirname, 'conf');
process.env.CK_PATH = __dirname;

const run = async function() {
  try {
    const config = await getConfig();

    webpack(config, (err, stats) => {
      if (err) {
        console.error(err.stack || err);

        if (err.details) {
          console.error(err.details);
        }

        process.exit(1);
      }

      console.log(stats.toString({
        chunks: false,
        colors: true
      }));

      if (err || stats.hasErrors()) {
        process.exit(1);
      }
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

run();
