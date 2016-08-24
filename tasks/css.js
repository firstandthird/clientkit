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
const triangle = require('postcss-triangle');
const svgo = require('postcss-svgo');
const cssnano = require('cssnano');
const pathExists = require('path-exists');
const mdcss = require('mdcss');
const mdcssTheme = require('mdcss-theme-clientkit');
const Logr = require('logr');
const log = new Logr({
  type: 'cli',
  renderOptions: {
    cli: {
      lineColor: 'green'
    }
  }
});

class CssTask {
  // loads config files:
  constructor(config, base) {
    this.config = config;
    this.base = base;
    this.cssVars = {};
    this.customMedia = {};
    // load css variables:
    Object.keys(config.color).forEach(color => {
      this.cssVars[`color-${color}`] = config.color[color];
    });
    Object.keys(config.spacing.default).forEach(spacing => {
      this.cssVars[`spacing-${spacing}`] = config.spacing.default[spacing];
    });
    Object.keys(config.grid).forEach(prop => {
      this.cssVars[`grid-${prop}`] = config.grid[prop];
    });
    if (config.vars) {
      Object.keys(config.vars).forEach(varName => {
        this.cssVars[varName] = config.vars[varName];
      });
    }
    // load spacing variables:
    Object.keys(config.breakpoints).forEach(breakpoint => {
      const constraint = config.core.mobileFirst ? 'min' : 'max';
      const width = config.breakpoints[breakpoint][`${constraint}-width`];
      const mediaquery = `(${constraint}-width: ${width})`;
      this.cssVars[`breakpoint-${breakpoint}`] = width;
      this.customMedia[breakpoint] = mediaquery;
    });
    // load mixins:
    const globalMixins = require('require-all')({
      dirname: path.join(__dirname, '..', 'styles', 'mixins'),
      resolve: m => m(config, postcss)
    });
    if (pathExists.sync(path.join(config.core.assetPath, 'mixins'))) {
      const localMixins = require('require-all')({
        dirname: path.join(config.core.assetPath, 'mixins'),
        resolve: m => m(config, postcss)
      });
      Object.assign(globalMixins, localMixins);
    }
    this.mixins = globalMixins;
  }

  performTask(input, callback, outputName) {
    this.input = input;
    const start = new Date().getTime();
    const processes = [
      cssimport({
        path: [
          path.resolve(__dirname, '../styles')
        ]
      }),
      cssmixins({
        mixins: this.mixins
      }),
      inlinesvg(),
      svgo(),
      triangle(),
      cssnext({
        warnForDuplicates: false,
        features: {
          customProperties: {
            variables: this.cssVars
          },
          customMedia: {
            extensions: this.customMedia
          }
        }
      }),
      mqpacker({
        sort: true
      })
    ];
    // Only run fonts against default.css to avoid duplicates
    if (input.match(this.config.core.fontParsingWhitelist)) {
      processes.push(cssfonts({
        foundries: ['custom', 'hosted', 'google']
      }));
    }

    if (this.config.docs.enabled && input.match(this.config.docs.input)) {
      processes.push(mdcss({
        theme: mdcssTheme({
          title: this.config.docs.title,
          logo: '',
          colors: this.config.color,
          variables: this.cssVars,
          examples: {
            css: this.config.docs.css
          }
        }),
        destination: path.join(this.config.core.dist.replace(process.cwd(), ''), 'styleguide')
      }));
    }

    // minify if specified in config files:
    if (this.config.core.minify) {
      processes.push(cssnano());
    }
    let inputCss;
    // the input could be either a file path or a CSS expression:
    if (path.extname(input) === '.css') {
      inputCss = fs.readFileSync(path.normalize(input));
    } else {
      inputCss = input;
    }
    const to = outputName ? outputName : 'temp.css';
    postcss(processes).process(inputCss, { from: input, to: to, map: { inline: false } })
    .then(result => {
      if (result.messages) {
        result.messages.forEach(message => {
          log([message.type], `${message.text} [${message.plugin}]`);
        });
      }

      this.result = result;
      const end = new Date().getTime();
      const duration = (end - start) / 1000;
      log(`Processed ${input} in ${duration} sec`);
      return callback(result);
    }, (err) => {
      if (err) {
        log(['error'], err.stack);
      }
    });
  }

  writeToFile(outputName) {
    if (!this.result) {
      log(['clientkit', 'css', 'warning'], `attempting to write empty string to ${outputName}`);
    }
    const output = path.join(this.config.core.dist, outputName);
    fs.writeFileSync(output, this.result.css);
    fs.writeFileSync(`${output}.map`, this.result.map);
    log(`Wrote: ${this.input} → ${output}`);
    log(`Wrote: ${this.input}.map → ${output}.map`);
  }

}
module.exports.CssTask = CssTask;
module.exports.runTaskAndWrite = function (config, base, outputName, input) {
  const task = new CssTask(config, base);
  task.performTask(input, () => {
    task.writeToFile(outputName);
  }, outputName);
};
module.exports.processOnly = function (config, base, input, callback) {
  const task = new CssTask(config, base);
  task.performTask(input, callback);
};
