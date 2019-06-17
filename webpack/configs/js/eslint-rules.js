module.exports = options => ({
  test: /\.js$/,
  enforce: 'pre',
  exclude: /node_modules/,
  use: {
    loader: 'eslint-loader',
    options: {
      emitWarning: !options.failOnError,
      failOnWarning: options.failOnError,
      failOnError: options.failOnError
    }
  }
});
