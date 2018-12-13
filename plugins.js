'use strict';

const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

const CleanOutput = new CleanWebpackPlugin(
  [
    process.env.dist
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

module.exports = [
  // DefineEnv,
  CleanOutput,
  FixStyleEntries,
  ExtractCSS,
  SpriteLoader
];
