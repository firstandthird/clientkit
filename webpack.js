#!/usr/bin/env node
/* eslint-disable no-console */
const getConfig = require('./webpack/get-config');
const chokidar = require('chokidar');
const webpack = require('webpack');
const paths = require('./paths');
const path = require('path');
const Styleguide = require('clientkit-styleguide');

const runStyleguide = function(config) {
  if (!config.styleguide.disabled) {
    const styleguide = new Styleguide('clientkit-styleguide', config.styleguide);
    styleguide.fullConfig = config;
    styleguide.execute(() => {});
  }
};

const runWebpack = async function () {
  let config = {};

  try {
    config = await getConfig();
  } catch (error) {
    console.log('There was an error getting the config!');
    console.log(error);
    process.exit(1);
  }

  try {
    webpack(config.compilers, (err, stats) => {
      if (err) {
        console.error(err.stack || err);

        if (err.details) {
          console.error(err.details);
        }

        if (config.config.failOnError) {
          process.exit(1);
        }
      }

      runStyleguide(config.config);

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

      if (config.config.failOnError && (err || stats.hasErrors())) {
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
      const configPaths = [
        path.join(paths.baseConfig, '/**/*.yaml'),
        path.join(paths.primaryConfig, '/**/*.yaml')
      ];

      const watcher = chokidar.watch(configPaths, {
        cwd: paths.baseConfig,
        ignoreInitial: true,
        interval: 300,
        persistent: true
      });

      const events = ['ready', 'add', 'change', 'unlink'];

      watcher.on('all', event => {
        if (events.includes(event)) {
          if (process.send) {
            process.send('Config file change');
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
