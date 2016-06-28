const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '..');

const config = require('confi')({
  path: [
    path.join(base, 'conf'),
    path.join(process.cwd(), 'conf')
  ]
});

const postcss = require('postcss');
const cssimport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const cssmixins = require('postcss-mixins');
const mqpacker = require('css-mqpacker');
const cssnano = require('cssnano');
const mkdirp = require('mkdirp');

mkdirp.sync(path.join(base, '.dist'));

const cssVars = {};

Object.keys(config.colors).forEach(color => {
  cssVars[`colors-${color}`] = config.colors[color];
});

const mixins = require('require-all')({
  dirname: path.join(base, 'styles/mixins'),
  resolve: m => m(config, postcss)
});

module.exports = function (cssFile) {
  const output = path.join(base, '.dist', cssFile);
  const input = path.join(base, 'styles', cssFile);

  postcss([
    cssimport,
    cssmixins({
      mixins
    }),
    cssnext({
      warnForDuplicates: false,
      features: {
        customProperties: {
          variables: cssVars
        }
      }
    }),
    mqpacker(),
    //cssnano()
  ]).process(fs.readFileSync(input), { from: input, to: output, map: { inline: false } })
    .then(result => {
      fs.writeFileSync(output, result.css);
      fs.writeFileSync(`${output}.map`, result.map);

      console.log(`Processed: ${input} → ${output}`);
    });
};
