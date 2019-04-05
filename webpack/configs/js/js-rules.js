module.exports = config => ({
  test: /\.m?js$/,
  exclude: /node_modules/,
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
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        [
          '@babel/plugin-transform-runtime', { regenerator: true }
        ]
      ],
      cacheDirectory: true,
      cacheCompression: config.minify,
      compact: config.minify
    }
  }
});
