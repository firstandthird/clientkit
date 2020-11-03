const StylelintPlugin = require('stylelint-webpack-plugin');

module.exports = options => {
  const context = options.stylesheets.assetPath;
  const shouldWarn = !options.stylelint.failOnError || !options.failOnError;
  const shouldFail = options.stylelint.failOnError || options.failOnError;

  return new StylelintPlugin({
    configFile: options.stylelint.configFile,
    ignorePath: options.stylelint.ignorePath,
    context,
    emitWarning: shouldWarn,
    failOnWarning: shouldFail,
    failOnError: shouldFail
  });
};
