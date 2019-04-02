const paths = require('../../../paths');

module.exports = options => {
  const loadConfig = {
    test: /\.svg$/,
    use: [
      {
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          spriteFilename: paths.isProduction ? '[chunkname].[hash].svg' : '[chunkname].svg'
        }
      },
      'svg-fill-loader'
    ]
  };

  if (options.svgsprite.useSVGO) {
    loadConfig.use.push({
      loader: 'svgo-loader',
      options: {
        plugins: options.svgsprite.svgoConfig
      }
    });
  }

  return loadConfig;
};
