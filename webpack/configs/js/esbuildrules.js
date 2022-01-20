module.exports = config => ({
  test: /\.m?js$/,
  exclude: /node_modules/,
  use: {
    loader: 'esbuild-loader',
    options: {
    }
  }
});


