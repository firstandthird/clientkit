const path = require('path');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

module.exports = config => ({
  test: /\.css$/,
  exclude: /node_modules/,
  use: [
    ExtractCssChunks.loader,
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        importLoaders: 1,
        localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: [
          require('postcss-import')({
            path: config.stylesheets.importPaths
          }),
          require('postcss-font-magician')({
            foundries: ['custom', 'hosted', 'google']
          }),
          require('postcss-mixins')({
            mixins: config.stylesheets.globalMixins,
            mixinsDir: config.stylesheets.mixinPath
          }),
          require('postcss-easings')(),
          require('postcss-inline-svg')(),
          require('postcss-svgo')(),
          require('postcss-triangle')(),
          require('postcss-nested')(),
          require('postcss-cssnext')({
            // browsers: ['last 2 versions', '> 5%'],
            warnForDuplicates: false,
            features: {
              customProperties: {
                variables: config.stylesheets.vars,
                preserve: 'computed',
                strict: false
              },
              customMedia: {
                extensions: config.stylesheets.customMedia
              },
              autoprefixer: config.stylesheets.autoprefixer,
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
          }),
          require('cssnano')({
            zindex: false,
            reduceIdents: false
          }) //env === 'production' ? options.cssnano : false
        ]
      }
    }
  ]
});
