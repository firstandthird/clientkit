module.exports = config => ({
  test: /\.m?js$/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        ['@babel/preset-env', {
          targets: config.browserlist
        }]
      ]
    }
  }
});
