/* eslint-disable no-console */
const path = require('path');

const loadConfi = require('./load-confi');
const paths = require('../paths');
const { cleanOutput } = require('./plugins');
const compilerConfigs = require('./configs');

const getConfig = async () => {
  const config = await loadConfi();

  const commonConfig = {
    mode: paths.env,
    stats: {
      timings: !paths.isProduction
    },
    resolve: {
      modules: [
        paths.clientkitPath,
        path.resolve(__dirname, 'node_modules'),
        path.resolve(process.cwd(), 'node_modules')
      ],
      alias: {
        lib: path.resolve(__dirname, 'node_modules')
      }
    },
    optimization: {
      minimize: !!config.minify,
      noEmitOnErrors: true
    },
    target: 'web',
    watch: !paths.isProduction
  };

  const compilers = [];
  const distFolders = [];

  const addDistDirectory = (directory) => {
    if (directory && !distFolders.includes(directory)) {
      distFolders.push(directory);
    }
  };

  if (config.svgsprite) {
    const svgConfig = Object.assign({}, commonConfig, compilerConfigs.svg(config));
    addDistDirectory(config.svgsprite.dist);
    compilers.push(svgConfig);

    console.log('Loading SVGSprite Compiler');
    console.log('[SVG] Dist folder "%s"', config.svgsprite.dist);
  }

  if (config.scripts) {
    const jsConfig = Object.assign({}, commonConfig, compilerConfigs.js(config));
    addDistDirectory(config.scripts.dist);
    compilers.push(jsConfig);

    console.log('Loading JS Compiler');
    console.log('[JS] Dist folder "%s"', config.scripts.dist);
  }

  if (config.stylesheets) {
    const cssConfig = Object.assign({}, commonConfig, compilerConfigs.css(config));
    addDistDirectory(config.stylesheets.dist);
    compilers.push(cssConfig);

    console.log('Loading CSS Compiler');
    console.log('[CSS] Dist folder "%s"', config.stylesheets.dist);
  }

  // Clean dist directories before compiling
  if (compilers.length) {
    const firstCompilerPlugins = compilers[0].plugins;

    if (firstCompilerPlugins && firstCompilerPlugins.length) {
      firstCompilerPlugins.unshift(cleanOutput(distFolders));
    } else {
      compilers[0].plugins = [cleanOutput(distFolders)];
    }
  }

  return compilers;
};

module.exports = getConfig;
