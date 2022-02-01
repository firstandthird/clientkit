const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const sortCSSmq = require('sort-css-media-queries');
const loadMixins = require('./load-mixins');
const loadVars = require('./load-variables');
const loadMedia = require('./load-media');
const paths = require('../../../paths');
const fontMagician = require('@alaguna/postcss-font-magician');
const removeEmpty = require('../../util/remove-empty');
const invokeIf = require('../../util/invoke-if');
const tailwind = require('tailwindcss');

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
      postcssOptions: {
        plugins: removeEmpty([
          // used to handle import statements in css:
          require('postcss-import')({
            path: cssConfig.importPaths
          }),
          // used to handle mixins like icon etc:
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
            autoprefixer: {
              overrideBrowserslist: config.browserlist
            },
            features: {
              'color-mod-function': { unresolved: 'warn' },
              'custom-media-queries': true,
              'nesting-rules': false,
              'focus-within-pseudo-class': { preserve: true }
            },
            importFrom: [{
              customProperties: loadVars(cssConfig),
              customMedia: loadMedia(cssConfig)
            }],
            preserve: false
          }),
          require('postcss-color-function')(),
          require('postcss-calc')(),
          tailwind({
            content: config.tailwind.content
          }),
          invokeIf(() => fontMagician({
            foundries: ['custom', 'hosted', 'google'],
            display: 'swap'
          }), !cssConfig.disableFontMagician),
          require('@alaguna/css-mqpacker')({
            sort: cssConfig.mobileFirst ? sortCSSmq : sortCSSmq.desktopFirst
          })
        ])
      }
    }
  };

  if (cssConfig.minify || paths.isProduction) {
    // plugin list could be in one of two different places currently:
    const pluginList = postCSSLoader.options.postcssOptions ? postCSSLoader.options.postcssOptions.plugins : postCSSLoader.options.plugins;
    pluginList.push(require('postcss-clean')({
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
