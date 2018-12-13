const path = require('path');
const confi = require('confi');

// Webpack modules
const loaders = require('../loaders');
const plugins = require('../plugins');

// Env variables
const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';
const prefix = process.env.CK_PREFIX || 'clientkit';
const baseConfig = process.env.CK_BASE_CONFIG || path.join(__dirname, 'conf');
const primaryConfig = process.env.CK_CONFIG || path.join(process.cwd(), prefix);

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

  const WebpackConfig = {
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
        path.resolve(__dirname, '../views'),
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
      rules: [
        loaders.eslintLoader(config.eslint),
        loaders.jsLoader,
        loaders.cssLoader(config.stylesheets),
        loaders.svgLoader(config.svgsprite)
      ]
    },
    watch: !isProduction,
    plugins: plugins(config)
  };

  return WebpackConfig;
};

module.exports = getConfig;
