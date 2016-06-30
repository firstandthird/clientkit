'use strict';

const fs = require('fs');
const path = require('path');

const postcss = require('postcss');
const cssimport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const cssmixins = require('postcss-mixins');
const mqpacker = require('css-mqpacker');
const cssfonts = require('postcss-font-magician');
const inlinesvg = require('postcss-inline-svg');
const svgo = require('postcss-svgo');
const cssnano = require('cssnano');

module.exports = function (config, base, outputName, input) {
  const cssVars = {};

  Object.keys(config.color).forEach(color => {
    cssVars[`color-${color}`] = config.color[color];
  });

  Object.keys(config.fonts).forEach(font => {
    cssVars[`font-${font}`] = config.fonts[font];
  });

  Object.keys(config.breakpoints).forEach(breakpoint => {
    cssVars[`breakpoint-${breakpoint}`] = config.breakpoints[breakpoint]['min-width'];

    Object.keys(config.spacing[breakpoint]).forEach(spacing => {
      cssVars[`spacing-${breakpoint}-${spacing}`] = config.spacing[breakpoint][spacing];
    })
  });

  const mixins = require('require-all')({
    dirname: path.join(base, 'styles/mixins'),
    resolve: m => m(config, postcss)
  });

  const output = path.join(config.CWD, '.dist', outputName);

  const processes = [
    cssimport,
    cssmixins({
      mixins
    }),
    inlinesvg(),
    svgo(),
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
    })
  ];

  // Only run fonts against default.css to avoid duplicates
  if (input.indexOf('default.css') !== -1) {
    processes.push(cssfonts({
      foundries: ['custom', 'hosted', 'google']
    }));
  }

  if (config.core.minify) {
    processes.push(cssnano());
  }

  postcss(processes).process(fs.readFileSync(input), { from: input, to: output, map: { inline: false } })
    .then(result => {
      fs.writeFileSync(output, result.css);
      fs.writeFileSync(`${output}.map`, result.map);

      console.log(`Processed: ${input} → ${output}`);
    });
};
