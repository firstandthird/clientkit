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
      sourceMap: !paths.isProduction,
      importLoaders: 1
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
          mixins: loadMixins(cssConfig),
          mixinsFiles: cssConfig.mixinPath
        }),
        require('postcss-easings')(),
        require('postcss-inline-svg')(),
        require('postcss-svgo')(),
        require('postcss-triangle')(),
        require('postcss-nested')(),
        require('postcss-preset-env')({
          stage: 0,
          browsers: config.browserlist,
          features: {
            'color-mod-function': { unresolved: 'warn' },
            'custom-media-queries': true,
            'nesting-rules': false
          },
          importFrom: [{
            customProperties: loadVars(cssConfig),
            customMedia: loadMedia(cssConfig)
          }],
          preserve: false
        }),
        require('postcss-color-function')(),
        require('postcss-calc')(),
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
