'use strict';

const ClientKitTask = require('clientkit-task');
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
const pkg = require('../package.json');

const addVarObject = (curVarName, curVarValue, curObject) => {
  if (typeof curVarValue === 'object') {
    // for each key in the object, set object recursively:
    Object.keys(curVarValue).forEach((nextVarName) => {
      addVarObject(`${curVarName}-${nextVarName}`, curVarValue[nextVarName], curObject);
    });
    return;
  }
  curObject[curVarName] = curVarValue;
};

class CSSTask extends ClientKitTask {
  // loads config files:
  constructor(name, config, runner) {
    super(name, config, runner);
    this.setup();
  }

  updateOptions(newOptions) {
    super.updateOptions(newOptions);
    this.setup();
  }

  setup() {
    const config = this.options;
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
    Object.keys(config.easing).forEach(prop => {
      this.cssVars[`easing-${prop}`] = config.easing[prop];
    });
    if (config.vars) {
      Object.keys(config.vars).forEach(varName => {
        addVarObject(varName, config.vars[varName], this.cssVars);
      });
    }
    // load spacing variables:
    Object.keys(config.breakpoints).forEach((breakpoint, i, bps) => {
      const breakpointObj = {
        min: config.breakpoints[breakpoint]['min-width'],
        max: config.breakpoints[breakpoint]['max-width'],
      };
      const constraint = config.mobileFirst ? 'min' : 'max';
      const width = breakpointObj[constraint];
      const mediaquery = `(${constraint}-width: ${width})`;
      let mediaqueryOnly;

      if (i === 0) {
        mediaqueryOnly = `(min-width: ${breakpointObj.min})`;
      } else {
        mediaqueryOnly = `(max-width: ${breakpointObj.max}) and (min-width: ${breakpointObj.min})`;
      }

      // Last one should be mobile, so no down
      if (i !== bps.length < 1) {
        this.customMedia[`${breakpoint}-down`] = `(max-width: ${breakpointObj.max})`;
      }

      // First one should be wide desktop so no up
      if (i !== 0) {
        this.customMedia[`${breakpoint}-up`] = `(min-width: ${breakpointObj.min})`;
      }

      this.cssVars[`breakpoint-${breakpoint}`] = width;
      this.customMedia[breakpoint] = mediaquery;
      this.customMedia[`${breakpoint}-only`] = mediaqueryOnly;
    });
    // load mixins:
    const globalMixins = require('require-all')({
      dirname: path.join(__dirname, '..', 'styles', 'mixins'),
      resolve: m => m(config, postcss)
    });
    if (pathExists.sync(path.join(config.assetPath, 'mixins'))) {
      const localMixins = require('require-all')({
        dirname: path.join(config.assetPath, 'mixins'),
        resolve: m => m(config, postcss)
      });
      Object.assign(globalMixins, localMixins);
    }
    this.mixins = globalMixins;
  }

  process(input, outputFilename, callback) {
    const processes = [
      cssimport({
        path: [
          path.resolve(__dirname, '../styles')
        ]
      }),
      cssmixins({
        mixins: this.mixins,
        mixinsFiles: path.resolve(__dirname, '../styles/mixins/*.css')
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
          },
          autoprefixer: this.options.autoprefixer
        }
      }),
      mqpacker({
        sort: (a, b) => {
          const reg = /\((max|min)-width: (\d+)(px|vw)\)/i;
          const aVal = a.match(reg);
          const bVal = b.match(reg);
          const av = aVal ? ~~aVal[2] : 0;
          const bv = bVal ? ~~bVal[2] : 0;

          let ret = bv - av;

          if (this.options.mobileFirst) {
            ret *= -1;
          }

          return ret;
        }
      })
    ];
    // Only run fonts against default.css to avoid duplicates
    if (input.match(this.options.fontParsingWhitelist)) {
      processes.push(cssfonts({
        foundries: ['custom', 'hosted', 'google']
      }));
    }

    if (this.options.docs.enabled && input.match(this.options.docs.input)) {
      processes.push(mdcss({
        theme: mdcssTheme({
          title: this.options.docs.title,
          logo: '',
          colors: this.options.color,
          variables: this.cssVars,
          css: [
            'style.css',
            '../clientkit.css'
          ],
          examples: {
            css: this.options.docs.css
          },
          info: {
            clientkitVersion: pkg.version
          },
          sectionOrder: this.options.docs.sectionOrder
        }),
        destination: path.join(this.options.dist.replace(process.cwd(), ''), 'styleguide')
      }));
    }

    // minify if specified in config files:
    if (this.options.minify) {
      processes.push(cssnano());
    }
    fs.readFile(input, (readErr, buf) => {
      if (readErr) {
        this.log(['error'], readErr);
      }
      postcss(processes).process(buf, { from: input, to: outputFilename, map: { inline: false } })
        .then(result => {
          if (result.messages) {
            result.messages.forEach(message => {
              if (message.text) {
                this.log([message.type], `${message.text} [${message.plugin}]`);
              }
            });
          }
          // write the source map if indicated:
          if (this.options.minify && this.options.sourcemap !== false) {
            return this.write(`${outputFilename}.map`, JSON.stringify(result.map), () => {
              this.write(outputFilename, result.css, callback);
            });
          }
          this.write(outputFilename, result.css, callback);
        }, (err) => {
          if (err) {
            this.log(['error'], err.stack);
          }
        });
    });
  }
}
module.exports = CSSTask;
