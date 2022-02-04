// this file assembles the js compiler config that webpack will use
// to transpile our js bundles
const eslintRules = require('./eslint-rules');
const jsRules = require('./js-rules');
const paths = require('../../../paths');
const entryNormalizer = require('../../entry-normalizer');
const fileNameGetter = require('../../file-name-getter');
const { assetsManifest } = require('../../plugins');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

module.exports = config => {
  const entryFiles = entryNormalizer(config.scripts.files, paths.tags);

  const jsConfig = {
    entry: entryFiles,
    devtool: (paths.isProduction) ? false : 'source-map',
    module: {
      rules: [
        eslintRules(config),
        jsRules(config)
      ]
    },
    optimization: {
      minimizer: [
        new ESBuildMinifyPlugin({
          target: 'es2015'
        })
      ]
    },
    output: {
      path: config.scripts.dist || config.dist,
      filename: fileNameGetter(config, '[name].js', '[name].[contenthash].js')
    },
    plugins: [],
    mode: paths.isProduction ? 'production' : 'development'
  };

  if (config.scripts.resolveAlias) {
    jsConfig.resolve = {
      alias: config.scripts.resolveAlias
    };
  }

  if (config.scripts.commonChunk) {
    const name = typeof config.scripts.commonChunk === 'string' ? config.scripts.commonChunk : 'commons';
    const minChunks = Math.ceil(Object.keys(entryFiles).length / 3);

    jsConfig.optimization.splitChunks = {
      cacheGroups: {
        commons: {
          name,
          chunks: 'all',
          minChunks
        }
      }
    };
  }

  if (!config.hash.disabled) {
    jsConfig.plugins.push(assetsManifest(config));
  }

  return jsConfig;
};
