module.exports = options => ({
  test: /\.js$/,
  enforce: 'pre',
  exclude: /node_modules/,
  use: {
    loader: 'eslint-loader',
    options: {
      failOnWarning: options.failOnError,
      failOnError: options.failOnError
    }
  }
});
