'use strict';
const describe = require('mocha').describe;
const it = require('mocha').it;
const expect = require('chai').expect;
const path = require('path');
const fs = require('fs');
const cssModule = require('../tasks/css.js');

const conf = require('confi')({
  path: [
    './conf'
  ],
  context: {
    CKDIR: __dirname,
    CONFIGDIR: path.join(process.cwd(), 'conf')
  }
});
const expectedCssString = fs.readFileSync('test/expectedOutputs/default.css').toString();

describe('default css output', function() {
  this.timeout(15000);
  it('detects dev changes that affect the expected CSS output', (done) => {
    // generate css against ./styles/default.css
    const cssTask = new cssModule.CssTask(conf, process.cwd());
    cssTask.performTask('./styles/default.css', (result) => {
      expect(typeof result.css).to.equal('string');
      console.log('result satisfied type condition...')
      console.log('results were:')
      console.log(result.css)
      expect(result.css).to.equal(expectedCssString);
      console.log('returning now....')
      done();
    });
  });
});
