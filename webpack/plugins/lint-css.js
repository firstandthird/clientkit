const StylelintPlugin = require('stylelint-webpack-plugin');

module.exports = options => {
  const context = options.stylesheets.assetPath;
  const shoudlWarn = !options.stylelint.failOnError || !options.failOnError;
  const shouldFail = options.stylelint.failOnError || options.failOnError;

  return new StylelintPlugin({
    configFile: `${options.CKDIR}/package.json`,
    ignorePath: `${options.CKDIR}/.stylelintignore`,
    context,
    emitWarning: shoudlWarn,
    failOnWarning: shouldFail,
    failOnError: shouldFail
  });
};
