module.exports = options => {
  const loadConfig = {
    test: /\.svg$/,
    use: [
      {
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          spriteFilename: '[chunkname]'
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
