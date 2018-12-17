module.exports = config => ({
  test: /\.m?js$/,
  exclude: /node_modules/,
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
