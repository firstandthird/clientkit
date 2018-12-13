const path = require('path');

module.exports = options => ({
  test: /\.js$/,
  enforce: 'pre',
  exclude: /node_modules/,
  use: {
    loader: 'eslint-loader',
    options: Object.assign({
      // configFile: path.resolve(__dirname, '.eslintrc')
    }, options)
  }
});
