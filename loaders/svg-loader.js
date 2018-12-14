const path = require('path');

module.exports = options => ({
  test: /\.svg$/,
  use: [
    {
      loader: 'svg-sprite-loader',
      options: {
        extract: true,
        spriteFilename: '[chunkname].svg'
      }
    },
    'svg-fill-loader',
    {
      loader: 'svgo-loader',
      options: {
        externalConfig: path.resolve(__dirname, '../svgo-config.yml')
      }
    }
  ]
});
