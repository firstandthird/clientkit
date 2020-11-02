const StylelintPlugin = require('stylelint-webpack-plugin');

module.exports = options => {
  const context = options.stylesheets.assetPath;
  const shoudlWarn = !options.stylelint.failOnError || !options.failOnError;
  const shouldFail = options.stylelint.failOnError || options.failOnError;

  return new StylelintPlugin({
    configFile: options.stylelint.configFile,
    ignorePath: options.stylelint.ignorePath,
    context,
    emitWarning: shoudlWarn,
    failOnWarning: shouldFail,
    failOnError: shouldFail
  });
};
