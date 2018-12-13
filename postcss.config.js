
const path = require('path');

module.exports = (ctx) => ({
  custom: ctx.options,
  plugins: {
    'postcss-import': {
      // path: this.options.importPaths
    },
    'postcss-font-magician': {
      foundries: ['custom', 'hosted', 'google']
    },
    'postcss-mixins': {
      mixins: path.join(__dirname, 'global'),
      mixinsDir: path.join(__dirname, 'mixins')
    },
    'postcss-easings': {},
    'postcss-inline-svg': {},
    'postcss-svgo': {},
    'postcss-triangle': {},
    'postcss-nested': {},
    'postcss-cssnext': {
      browsers: ['last 2 versions', '> 5%'],
      warnForDuplicates: false,
      features: {
        customProperties: {
          variables: {
            'custom-color': 'red'
          },
          preserve: 'computed',
          strict: false
        },
        customMedia: {
          extensions: {
            tablet: '(min-width: 1000px)'
          }
        },
        autoprefixer: {
          browsers: ['last 2 versions', 'iOS 9']
        },
        nesting: false
      }
    },
    'css-mqpacker': {
      sort: (a, b) => {
        const reg = /\((max|min)-width: (\d+)(px|vw)\)/i;
        const aVal = a.match(reg);
        const bVal = b.match(reg);
        const av = aVal ? ~~aVal[2] : 0;
        const bv = bVal ? ~~bVal[2] : 0;

        return bv - av;
      }
    },
    cssnano: {
      zindex: false,
      reduceIdents: false
    } //env === 'production' ? options.cssnano : false
  }
});
