'use strict';

const fs = require('fs');
const path = require('path');

const postcss = require('postcss');
const cssimport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const cssmixins = require('postcss-mixins');
const mqpacker = require('css-mqpacker');
const cssnano = require('cssnano');

module.exports = function (config, base, outputName, input) {
  const cssVars = {};

  Object.keys(config.color).forEach(color => {
    cssVars[`color-${color}`] = config.color[color];
  });

  Object.keys(config.spacing).forEach(breakpoint => {
    Object.keys(config.spacing[breakpoint]).forEach(spacing => {
      cssVars[`spacing-${breakpoint}-${spacing}`] = config.spacing[breakpoint][spacing];
    })
  });

  const mixins = require('require-all')({
    dirname: path.join(base, 'styles/mixins'),
    resolve: m => m(config, postcss)
  });

  const output = path.join(config.CWD, '.dist', outputName);

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
    mqpacker({
      sort: true
    }),
    // cssnano()
  ]).process(fs.readFileSync(input), { from: input, to: output, map: { inline: false } })
    .then(result => {
      fs.writeFileSync(output, result.css);
      fs.writeFileSync(`${output}.map`, result.map);

      console.log(`Processed: ${input} → ${output}`);
    });
};
