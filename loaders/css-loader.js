const path = require('path');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

module.exports = options => ({
  test: /\.css$/,
  exclude: /node_modules/,
  use: [
    ExtractCssChunks.loader,
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        importLoaders: 1,
        localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        config: {
          path: path.resolve(__dirname, 'postcss.config.js'),
          sourceMap: true
        }
      }
    }
  ]
});
