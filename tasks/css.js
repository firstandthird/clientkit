const config = require('confi')();
const postcss = require('postcss');
const cssimport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const cssmixins = require('postcss-mixins');
const mqpacker = require('css-mqpacker');
const cssnano = require('cssnano');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

mkdirp.sync(path.join(process.cwd(), '.dist'));

const cssVars = {};

Object.keys(config.colors).forEach(color => {
  cssVars[`colors-${color}`] = config.colors[color];
});

const mixins = require('require-all')({
  dirname: path.join(process.cwd(), 'styles/mixins'),
  resolve: m => m(config, postcss)
});

module.exports = function (cssFile) {
  const output = path.join(process.cwd(), '.dist', cssFile);
  const input = path.join(process.cwd(), 'styles', cssFile);

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
