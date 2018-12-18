#!/usr/bin/env node
/* eslint-disable no-console */
const getConfig = require('./webpack/get-config');
const webpack = require('webpack');

const run = async function() {
  let config = null;

  try {
    config = await getConfig();
  } catch (error) {
    console.log('There was an error getting the config!');
    console.log(error);
    process.exit(1);
  }

  try {
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
    console.log('There was an error running clientkit!');
    console.log('Config was:');
    console.log(config);
    console.log(error);
    process.exit(1);
  }
};

run();
