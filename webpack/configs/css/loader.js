const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const sortCSSmq = require('sort-css-media-queries');
const loadMixins = require('./load-mixins');
const loadVars = require('./load-variables');
const loadMedia = require('./load-media');
const paths = require('../../../paths');

module.exports = config => {
  const cssConfig = config.stylesheets;
  const cssLoader = {
    loader: 'css-loader',
    options: {
      url: false,
      sourceMap: true,
      importLoaders: 1,
      localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
    }
  };

  const postCSSLoader = {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: [
        require('postcss-import')({
          path: cssConfig.importPaths
        }),
        require('postcss-mixins')({
          mixins: loadMixins(cssConfig)
        }),
        require('postcss-easings')(),
        require('postcss-inline-svg')(),
        require('postcss-svgo')(),
        require('postcss-triangle')(),
        require('postcss-nested')(),
        require('postcss-cssnext')({
          warnForDuplicates: false,
          browsers: config.browserlist,
          features: {
            customProperties: {
              variables: loadVars(cssConfig),
              preserve: 'computed',
              strict: false
            },
            customMedia: {
              extensions: loadMedia(cssConfig)
            },
            nesting: false
          }
        }),
        require('postcss-font-magician')({
          foundries: ['custom', 'hosted', 'google'],
          display: 'swap'
        }),
        require('css-mqpacker')({
          sort: cssConfig.mobileFirst ? sortCSSmq : sortCSSmq.desktopFirst
        })
      ]
    }
  };

  if (cssConfig.minify || paths.isProduction) {
    postCSSLoader.options.plugins.push(require('cssnano')({
      zindex: false,
      reduceIdents: false
    }));
  }

  return {
    test: /\.css$/,
    exclude: /node_modules/,
    use: [
      ExtractCssChunks.loader,
      cssLoader,
      postCSSLoader
    ]
  };
};
