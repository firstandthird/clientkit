'use strict';

const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

const plugins = config => {
  const CleanOutput = new CleanWebpackPlugin(
    [
      config.dist
    ],
    {
      watch: false,
      allowExternal: true
    }
  );

  const FixStyleEntries = new FixStyleOnlyEntriesPlugin({
    extensions: [
      'css',
      'svg'
    ],
    silent: true
  });

  const ExtractCSS = new ExtractCssChunks({
    filename: '[name].css',
    chunkFilename: '[name].css'
  });

  const SpriteLoader = new SpriteLoaderPlugin();

  return [
    CleanOutput,
    FixStyleEntries,
    ExtractCSS,
    SpriteLoader
  ];
};

module.exports = plugins;
