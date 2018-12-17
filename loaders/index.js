const svgLoader = require('./svg-loader');
const cssLoader = require('./css');
const eslintLoader = require('./eslint-loader');
const jsLoader = require('./js-loader');

const loaders = {
  svgLoader,
  cssLoader,
  eslintLoader,
  jsLoader
};

module.exports = loaders;
