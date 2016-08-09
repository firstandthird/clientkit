'use strict';
const getStdin = require('get-stdin');
const Logr = require('logr');
const log = new Logr({
  type: 'cli',
  renderOptions: {
    cli: {
      lineColor: 'cyan'
    }
  }
});

const printCssToScreen = (conf, cssTask) => {
  cssTask.processOnly(conf, process.cwd(), conf.cssExpression, (result) => {
    // strips out the little addendum at the bottom of the css:
    log(result.css.split(`/*# sourceMappingURL=none.map */`)[0]);
  });
};

const showCssFromStdin = (conf, cssTask) => {
// if they didn't pass a value into argv.css, look in stdin for the css expression or filename:
  getStdin().then(str => {
    if (str[str.length - 1] === '\n') {
      str = str.replace('\n', '');
    }
    conf.cssExpression = str;
    printCssToScreen(conf, cssTask);
  });
};

module.exports.showCss = (conf) => {
  const cssTask = require('../tasks/css.js');
  if (typeof conf.cssExpression === 'string') {
    printCssToScreen(conf, cssTask);
  } else {
    showCssFromStdin(conf, cssTask);
  }
};

module.exports.showOptions = (conf) => {
  const cssProcessor = require('../tasks/css.js');
  const cssTask = new cssProcessor.CssTask(conf, process.cwd());
  log('Available Mixins:');
  log('------------------------------------------------');
  Object.keys(cssTask.mixins).forEach((mixinName) => {
    log(mixinName);
  });
  log('------------------------------------------------');
  log('Available Variables:');
  log('------------------------------------------------');
  Object.keys(cssTask.cssVars).forEach((varName) => {
    log(`${varName} : ${cssTask.cssVars[varName]}`);
  });
  log('------------------------------------------------');
  log('Custom Media:');
  log('------------------------------------------------');
  Object.keys(cssTask.customMedia).forEach((mediaName) => {
    log(`${mediaName} : ${cssTask.customMedia[mediaName]}`);
  });
  log('------------------------------------------------');
};
