module.exports = config => ({
  test: /\.m?js$/,
  use: {
    loader: 'babel-loader',
    options: {
      babelrc: false,
      configFile: false,
      presets: [
        [
          '@babel/preset-env',
          {
            targets: config.browserlist,
            useBuiltIns: false,
            modules: false,
            exclude: ['transform-typeof-symbol']
          }
        ]
      ],
      cacheDirectory: true,
      cacheCompression: config.minify,
      compact: config.minify
    }
  }
});
