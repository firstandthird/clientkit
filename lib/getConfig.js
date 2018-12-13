const path = require('path');
const confi = require('confi');

// Webpack modules
const loaders = require('../loaders');
const plugins = require('../plugins');

// Env variables
const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';
const prefix = process.env.CK_PREFIX || 'clientkit';
const baseConfig = process.env.CK_BASE_CONFIG;
const primaryConfig = process.env.CK_CONFIG || path.join(process.cwd(), prefix);
const assetPath = process.env.ASSET_PATH || path.join(__dirname, '../public', '_dist');

const getConfig = async () => {
  const configPaths = [];
  let config = {};

  if (baseConfig) {
    configPaths.push(baseConfig);
  }

  configPaths.push(primaryConfig);
  configPaths.push({
    env,
    path: process.cwd(),
    prefix
  });

  try {
    config = await confi({
      path: configPaths,
      package: {
        key: prefix
      },
      context: {
        CONFIGDIR: primaryConfig
      }
    });
  } catch (error) {
    console.log(error);
  }

  const entryFiles = {};

  if (config.svgsprite) {
    entryFiles.svgsprite = Object.assign(entryFiles, config.svgsprite.files);
  }

  if (config.scripts) {
    entryFiles.scripts = Object.assign(entryFiles, config.scripts.files);
  }

  if (config.stylesheets) {
    entryFiles.stylesheets = Object.assign(entryFiles, config.stylesheets.files);
  }

  // console.log(config);

  const WebpackConfig = {
    mode: env,
    devtool: 'source-map',
    // context: path.join(__dirname, '../views'),
    entry: entryFiles,
    stats: {
      timings: !isProduction
    },
    output: {
      path: assetPath,
      filename: '[name].js'
      // filename: '[name].[chunkhash:4].js'
    },
    resolve: {
      modules: [
        path.resolve(__dirname, '../views'),
        path.resolve(__dirname, 'node_modules')
      ],
      alias: {
        lib: path.resolve(__dirname, 'node_modules')
      }
    },
    optimization: {
      minimize: isProduction,
      // splitChunks: {
      //   chunks: 'all'
      // }
    },
    target: 'web',
    module: {
      rules: [
        loaders.eslintLoader(config.eslint),
        loaders.jsLoader,
        loaders.cssLoader(config.stylesheets),
        loaders.svgLoader(config.svgsprite)
      ]
    },
    watch: !isProduction,
    plugins
  };

  return WebpackConfig;
};

module.exports = getConfig;
