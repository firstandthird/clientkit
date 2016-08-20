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

describe('default css output', function() {
  this.timeout(15000);
  it('detects dev changes that affect the expected CSS output', (done) => {
    // generate css against ./styles/default.css
    const cssTask = new cssModule.CssTask(conf, process.cwd());
    cssTask.performTask('./styles/default.css', (result) => {
      const expectedCssString = fs.readFileSync('test/expectedOutputs/default.css').toString();
      expect(typeof result.css).to.equal('string');
      console.log(`first is lenght ${result.css.length}`)
      console.log(`compare to ${expectedCssString.length}`)
      expect(result.css.length).to.equal(expectedCssString.length);
      done();
    });
  });
});
