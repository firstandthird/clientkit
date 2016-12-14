// pre-compile views
'use strict';
const ClientKitTask = require('clientkit-task');
const path = require('path');
const compileEngine = require('nunjucks');
const async = require('async');
const fs = require('fs');

class TemplateTask extends ClientKitTask {

  constructor(name, config, runner) {
    super(name, config, runner);
    this.templateMap = {};
  }

  get description() {
    return 'Precompiles and pre-renders static template files, and compiles non-static ones for faster run-time rendering';
  }

  // use this public method for all your view rendering needs:
  render(templateName, data) {
    if (this.templateMap[templateName]) {
      return this.templateMap[templateName].render(data);
    }
    return compileEngine.render(templateName, data);
  }

  // compile a template so it's all ready to render with later:
  compile(directive, done) {
    if (Array.isArray(directive.input)) {
      return done(new Error('multiple files were passed to compile option, it can only handle one file.'));
    }
    fs.readFile(directive.input, (err, data) => {
      if (err) {
        return done(err);
      }
      this.templateMap[directive.input] = compileEngine.compile(data.toString('utf-8'));
      return done();
    });
  }

  precompileStaticTemplate(item, done) {
    const data = item.data ? item.data : {};
    const output = compileEngine.render(item.input, data);
    this.write(path.basename(item.input), output, done);
  }

  precompileAll(directive, allDone) {
    if (Array.isArray(directive.input)) {
      const inputs = directive.input;
      return async.each(inputs, (item, done) => {
        directive.input = item;
        this.precompileStaticTemplate(directive, done);
      }, allDone);
    }
    this.precompileStaticTemplate(directive, allDone);
  }

  process(input, filename, processDone) {
    if (input.type === 'compile') {
      this.compile(input, processDone);
    } else {
      this.precompileAll(input, processDone);
    }
  }
}

module.exports = TemplateTask;
