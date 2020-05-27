const fileNameGetter = require('../../file-name-getter');

module.exports = options => {
  const loadConfig = {
    test: /\.svg$/,
    use: [
      {
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          esModule: false,
          spriteFilename: fileNameGetter(options, '[chunkname].svg', '[chunkname].[hash].svg')
        }
      },
      'svg-transform-loader'
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
