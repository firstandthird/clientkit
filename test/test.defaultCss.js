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
const expectedCssString = fs.readFileSync('./test/expectedOutputs/default.css').toString();

describe('default css output', function() {
  it('unmodified output will look like the expected CSS string', (done) => {
    // generate css against ./styles/default.css
    cssModule.runTaskAndWrite(conf, path.join(process.cwd(), 'test'), 'testDefault.css', './styles/default.css');
    expect(fs.existsSync('./.dist/testDefault.css')).to.equal(true);
    const cssString = fs.readFileSync('./.dist/testDefault.css').toString();
    expect(typeof cssString).to.equal('string');
    expect(cssString).to.equal(expectedCssString);
    done();
  });
});
