const path = require('path');

// Webpack modules
const loadConfi = require('./load-confi');
const loaders = require('../loaders');
const plugins = require('../plugins');
const paths = require('../paths');

// Env variables
const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';

const getConfig = async () => {
  const config = await loadConfi();

  let entryFiles = {};

  if (config.svgsprite) {
    entryFiles = Object.assign(entryFiles, config.svgsprite.files);
  }

  if (config.scripts) {
    entryFiles = Object.assign(entryFiles, config.scripts.files);
  }

  if (config.stylesheets) {
    entryFiles = Object.assign(entryFiles, config.stylesheets.files);
  }

  return {
    mode: env,
    devtool: 'source-map',
    // context: path.join(__dirname, '../views'),
    entry: entryFiles,
    stats: {
      timings: !isProduction
    },
    output: {
      publicPath: config.assetPath,
      path: config.dist,
      filename: '[name]'
      // filename: '[name].[chunkhash:4].js'
    },
    resolve: {
      modules: [
        paths.clientkitPath,
        path.resolve(__dirname, 'node_modules')
      ],
      alias: {
        lib: path.resolve(__dirname, 'node_modules')
      }
    },
    optimization: {
      minimize: !!config.minify,
      // splitChunks: {
      //   chunks: 'all'
      // }
    },
    target: 'web',
    module: {
      rules: loaders(config)
    },
    watch: !isProduction,
    plugins: plugins(config)
  };
};

module.exports = getConfig;
