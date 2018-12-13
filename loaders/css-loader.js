const path = require('path');
const pathExists = require('path-exists');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

module.exports = ({ stylesheets: cssConfig }) => {
  // Load mixins
  let globalMixins = {};

  if (cssConfig.globalMixins) {
    try {
      globalMixins = require('require-all')({
        dirname: path.join(cssConfig.globalMixins),
        resolve: m => m(cssConfig)
      });
    } catch (e) {
      this.log(e);
    }
  }

  if (cssConfig.assetPath && pathExists.sync(path.join(cssConfig.assetPath, 'mixins'))) {
    const localMixins = require('require-all')({
      dirname: path.join(cssConfig.assetPath, 'mixins'),
      resolve: m => m(cssConfig)
    });

    Object.assign(globalMixins, localMixins);
  }

  return {
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
              path: cssConfig.importPaths
            }),
            require('postcss-font-magician')({
              foundries: ['custom', 'hosted', 'google']
            }),
            require('postcss-mixins')({
              mixins: globalMixins
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
            }),
            require('cssnano')({
              zindex: false,
              reduceIdents: false
            }) //env === 'production' ? options.cssnano : false
          ]
        }
      }
    ]
  };
};
