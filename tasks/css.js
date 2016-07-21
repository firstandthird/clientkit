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
const pathExists = require('path-exists');
const Logr = require('logr');
const log = new Logr({
  type: 'cli',
  renderOptions: {
    cli: {
      lineColor: 'green'
    }
  }
});

module.exports = function (config, base, outputName, input) {
  const start = new Date().getTime();
  const cssVars = {};
  const customMedia = {};

  Object.keys(config.color).forEach(color => {
    cssVars[`color-${color}`] = config.color[color];
  });

  Object.keys(config.fonts).forEach(font => {
    cssVars[`font-${font}`] = config.fonts[font];
  });

  Object.keys(config.breakpoints).forEach(breakpoint => {
    const constraint = config.core.mobileFirst ? 'min' : 'max';
    const width = config.breakpoints[breakpoint][`${constraint}-width`];
    const mediaquery = `(${constraint}-width: ${width})`;

    cssVars[`breakpoint-${breakpoint}`] = width;
    customMedia[breakpoint] = mediaquery;
  });

  Object.keys(config.spacing.default).forEach(spacing => {
    cssVars[`spacing-${spacing}`] = config.spacing.default[spacing];
  });

  Object.keys(config.grid).forEach(prop => {
    cssVars[`grid-${prop}`] = config.grid[prop];
  });

  const mixins = require('require-all')({
    dirname: path.join(base, 'styles/mixins'),
    resolve: m => m(config, postcss)
  });

  if (pathExists.sync(path.join(config.core.assetPath, 'mixins'))) {
    const localMixins = require('require-all')({
      dirname: path.join(config.core.assetPath, 'mixins'),
      resolve: m => m(config, postcss)
    });

    Object.assign(mixins, localMixins);
  }

  const output = path.join(config.core.dist, outputName);

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
        },
        customMedia: {
          extensions: customMedia
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

      const end = new Date().getTime();
      const duration = (end - start) / 1000;
      log(`Processed: ${input} → ${output} in ${duration} sec`);
    }, (err) => {
      if (err) {
        log(['error'], err.stack);
      }
    });
};
