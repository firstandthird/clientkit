const path = require('path');

const loadConfi = require('./load-confi');
const paths = require('../paths');
const { cleanOutput } = require('../plugins');

const getCssConfig = require('./get-css-config');
const getJsConfig = require('./get-js-config');
const getSvgConfig = require('./get-svg-config');

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
    const svgConfig = Object.assign({}, commonConfig, getSvgConfig(config));
    addDistDirectory(config.svgsprite.dist);
    compilers.push(svgConfig);
  }

  if (config.scripts) {
    const jsConfig = Object.assign({}, commonConfig, getJsConfig(config));
    addDistDirectory(config.scripts.dist);
    compilers.push(jsConfig);
  }

  if (config.stylesheets) {
    const cssConfig = Object.assign({}, commonConfig, getCssConfig(config));
    addDistDirectory(config.stylesheets.dist);
    compilers.push(cssConfig);
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
