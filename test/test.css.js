'use strict';
const describe = require('mocha').describe;
const it = require('mocha').it;
const expect = require('chai').expect;
const cssModule = require('../tasks/css.js');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const conf = require('confi')({
  path: [
    './conf'
  ],
  context: {
    CKDIR: __dirname,
    CONFIGDIR: path.join(process.cwd(), 'examples/clientkit')
  }
});
describe('css task', function() {
  this.timeout(15000);
  it('can load the object', (done) => {
    const cssTask = new cssModule.CssTask(conf, process.cwd());
    expect(typeof cssTask).to.equal('object');
    //todo: should verify more
    Object.keys(conf.color).forEach((color) => {
      expect(cssTask.cssVars[`color-${color}`]).to.equal(conf.color[color]);
    });
    expect(Object.keys(cssTask.mixins).length).to.be.greaterThan(0);
    Object.keys(cssTask.mixins).forEach((mixinName) => {
      expect(typeof cssTask.mixins[mixinName]).to.equal('function');
    });
    done();
  });
  it('can parse css', (done) => {
    const cssTask = new cssModule.CssTask(conf, process.cwd());
    cssTask.performTask('@mixin spacing margin, yaxis, xl', (result) => {
      expect(result.css).to.include('margin-top: 80px;\nmargin-bottom: 80px\n');
      done();
    });
  });
  it('can parse css and minimze it', (done) => {
    conf.core.minify = true;
    const cssTask = new cssModule.CssTask(conf, process.cwd());
    cssTask.performTask('@mixin spacing', (result) => {
      expect(result.css).to.include('.padding-none{padding:0}');
      conf.core.minify = false;
      done();
    });
  });
  it('can parse css files', (done) => {
    const cssTask = new cssModule.CssTask(conf, process.cwd());
    cssTask.performTask('./styles/helpers/spacing.css', (result) => {
      // just need to verify it output some spacing css:
      expect(result.css).to.include('.margin-yaxis-sm');
      done();
    });
  });
  it('can parse css and write it to file correctly', (done) => {
    conf.core.dist = path.join(__dirname, '.dist');
    mkdirp.sync(conf.core.dist);
    const cssTask = new cssModule.CssTask(conf, process.cwd());
    cssTask.performTask('@mixin spacing', () => {
      cssTask.writeToFile('test.css');
      try {
        const file = fs.readFileSync(path.join(conf.core.dist, 'test.css')).toString();
        // check the first css class:
        const first = file.split('.padding-xl')[0];
        expect(first).to.equal('.padding-none {\n    padding-top: 0;\n    padding-bottom: 0;\n    padding-left: 0;\n    padding-right: 0\n}\n');
      } catch (e) {
        expect(false).to.equal(true);
      }
      done();
    });
  });
});
