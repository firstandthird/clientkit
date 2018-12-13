const path = require('path');

module.exports = (options) => {
  return {
    test: /\.svg$/,
    use: [
      {
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          spriteFilename: 'sprite.symbol.svg'
        }
      },
      'svg-fill-loader',
      {
        loader: 'svgo-loader',
        options: {
          externalConfig: path.resolve(__dirname, 'svgo-config.yml')
        }
      }
    ]
  };
};
