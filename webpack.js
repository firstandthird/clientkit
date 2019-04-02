#!/usr/bin/env node
/* eslint-disable no-console */
const getConfig = require('./webpack/get-config');
const chokidar = require('chokidar');
const webpack = require('webpack');
const paths = require('./paths');

const runWebpack = async function () {
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
        timings: !paths.isProduction,
        builtAt: false,
        assets: false,
        cached: false,
        cachedAssets: false,
        colors: true,
        chunks: false,
        chunkGroups: false,
        chunkModules: false,
        chunkOrigins: false,
        hash: false,
        modules: false,
        moduleTrace: false,
        version: false
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

const run = () => {
  runWebpack();

  if (paths.isDevTask) {
    try {
      const watcher = chokidar.watch('./**/*.yaml', {
        cwd: paths.baseConfig,
        ignoreInitial: true,
        interval: 300,
        persistent: true
      });

      const events = ['ready', 'add', 'change', 'unlink'];

      watcher.on('all', event => {
        if (events.includes(event)) {
          if (process.send) {
            process.send('Child process finished');
          }
        }
      });
    } catch (error) {
      console.log('There was an error running config watcher!');
      console.log(error);
      process.exit(1);
    }
  }
};

run();
