#!/usr/bin/env node
/* eslint-disable no-console */
/*
  the basic flow of clientkit is to build a webpack config object
  for svg, js and css and then pass it to webpack
*/
const getConfig = require('./webpack/get-config');
const chokidar = require('chokidar');
const webpack = require('webpack');
const paths = require('./paths');
const path = require('path');
const Styleguide = require('clientkit-styleguide');

// will output a styleguide.html file if you have the setting enabled:
const runStyleguide = function(config) {
  if (!config.styleguide.disabled) {
    const styleguide = new Styleguide('clientkit-styleguide', config.styleguide);
    styleguide.fullConfig = config;
    styleguide.execute(() => {});
  }
};

const printAllErrors = !(process.argv.includes('nolog'));
// handles reporting build errors to console
const logErrors = (config, stats) => {
  const statStr = stats.toString({
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
  });
  const array = statStr.split('\n');
  for (let index = 0; index < array.length; index++) {
    const line = array[index];
    // optional annoying beep on errors:
    if (config.config.annoyingErrorBeep && line.includes('ERROR')) {
      console.log('\007');
    }
    // this plugin spams your channel, so ignore it:
    if (line.includes('extract-css-chunks-webpack-plugin')) {
      return;
    }
    if (line.includes('extract-css-chunks-webpage-plugin')) {
      return;
    }
    console.log(line);
  }
};

// 1. assembles the webpack config for svg, js and css
// 2. runs webpack with those configs (svg builder -> esbuild -> postcss)
// 3. prints out stats and any errors
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
    // the three compilers passed to webpack are:
    // svg, js, css
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

      // clientkit will only print a minimal amount of stuff
      // if there are no build errors present
      // even if there are errors it will try to suppress
      // some of the more verbose plugins from spamming the channel
      if (stats.hasErrors() && printAllErrors) {
        logErrors(config, stats);
      }
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
