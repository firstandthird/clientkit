const StylelintPlugin = require('stylelint-webpack-plugin');

module.exports = (files, options) => new StylelintPlugin({
  files,
  emitWarning: !options.stylelint.failOnError || !options.failOnError,
  failOnWarning: options.stylelint.failOnError || options.failOnError,
  failOnError: options.stylelint.failOnError || options.failOnError
});
