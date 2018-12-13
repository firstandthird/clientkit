const svgLoader = require('./svg-loader');
const cssLoader = require('./css-loader');
const eslintLoader = require('./eslint-loader');
const jsLoader = require('./js-loader');

module.exports = config => [
  svgLoader(config),
  cssLoader(config),
  eslintLoader(config),
  jsLoader
];
