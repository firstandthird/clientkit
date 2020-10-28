module.exports = options => {
  const shoudlWarn = !options.eslint.failOnError || !options.failOnError;
  const shouldFail = options.eslint.failOnError || options.failOnError;

  return {
    test: /\.js$/,
    enforce: 'pre',
    exclude: /node_modules/,
    use: {
      loader: 'eslint-loader',
      options: {
        emitWarning: shoudlWarn,
        failOnWarning: shouldFail,
        failOnError: shouldFail
      }
    }
  };
};
