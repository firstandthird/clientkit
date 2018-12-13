const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const loadMixins = require('./load-mixins');

module.exports = config => {
  const cssConfig = config.stylesheets;
  const cssLoader = {
    loader: 'css-loader',
    options: {
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
        require('postcss-font-magician')({
          foundries: ['custom', 'hosted', 'google']
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
          features: {
            customProperties: {
              variables: cssConfig.vars,
              preserve: 'computed',
              strict: false
            },
            customMedia: {
              extensions: cssConfig.customMedia
            },
            autoprefixer: cssConfig.autoprefixer,
            nesting: false
          }
        }),
        require('css-mqpacker')({
          sort: (a, b) => {
            const reg = /\((max|min)-width: (\d+)(px|vw)\)/i;
            const aVal = a.match(reg);
            const bVal = b.match(reg);
            const av = aVal ? ~~aVal[2] : 0;
            const bv = bVal ? ~~bVal[2] : 0;

            return bv - av;
          }
        })
      ]
    }
  };

  if (config.env === 'production') {
    postCSSLoader.plugins.push(require('cssnano')({
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
