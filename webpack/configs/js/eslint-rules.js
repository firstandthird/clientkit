module.exports = options => {
  const shouldWarn = !options.eslint.failOnError || !options.failOnError;
  const shouldFail = options.eslint.failOnError || options.failOnError;

  return {
    test: /\.js$/,
    enforce: 'pre',
    exclude: /node_modules/,
    use: {
      loader: 'eslint-loader',
      options: {
        emitWarning: shouldWarn,
        failOnWarning: shouldFail,
        failOnError: shouldFail
      }
    }
  };
};
