'use strict';
const describe = require('mocha').describe;
const it = require('mocha').it;
const expect = require('chai').expect;
const path = require('path');
const fs = require('fs');

// global config object for each test
const conf = require('confi')({
  path: [
    './conf'
  ],
  context: {
    CKDIR: __dirname,
    CONFIGDIR: path.join(process.cwd(), 'examples/clientkit')
  }
});
conf.consoleOnly = true;

const compare = (result, fileName) => {
  const json = require(path.join(process.cwd(), `test/expectedOutputs/mixins/${fileName}`));
  expect(json).to.deep.equal(result);
};

describe('bg colors mixin', function() {
  it('generates css bg colors', (done) => {
    const colors = require('../styles/mixins/bg-colors.js')(conf);
    const result = colors({});
    compare(result, 'bg-colors.js');
    done();
  });
});

describe('bg image mixin', function() {
  it('generates css bg image', (done) => {
    const image = require('../styles/mixins/bg-image.js')(conf);
    const result = image({}, 'http://nope.com/myImage.jpg');
    compare(result, 'bg-image.js');
    done();
  });
});

describe('buttons mixin', function() {
  this.timeout(20000);
  it('generates css for buttons', (done) => {
    const button = require('../styles/mixins/button.js')(conf);
    // mixin, bgColor, fgColor, type
    const result = button({}, '#ff0000', '#00ff00', 'outline');
    compare(result, 'button.js');
    done();
  });
});

describe('fancy-underline', function() {
  it('renders a fancy-underline', (done) => {
    const fancy = require('../styles/mixins/fancy-underline.js')(conf);
    // (rule, backgroundColor, linkColor, hoverColor, offset, width, activeOffset) {
    const result = fancy({}, '#333', '#111', '#fff', 10, 12, 15);
    compare(result, 'fancy-underline.js');
    done();
  });
});

describe('font-style', function() {
  it('generates a group of font classes', (done) => {
    const font = require('../styles/mixins/font-style.js')(conf);
    const result = font({});
    compare(result, 'font-style.js');
    done();
  });

  it('generates a sized font class', (done) => {
    const font = require('../styles/mixins/font-style.js')(conf);
    const result = font({}, 'font-small');
    expect(result['font-size']).to.equal(conf.fontStyles.default['font-small']['font-size']);
    const result2 = font({}, 'font-large');
    expect(result2['font-size']).to.equal(conf.fontStyles.default['font-large']['font-size']);
    done();
  });
});

describe('grid', function() {
  it('generates grid classes', (done) => {
    const grid = require('../styles/mixins/grid.js')(conf);
    const result = grid({});
    compare(result, 'grid.js');
    done();
  });
});

describe('hide', function() {
  it('generates hide classes', (done) => {
    const hide = require('../styles/mixins/hide.js')(conf);
    const result = hide({}, 'sm', 'block');
    expect(result['@media (max-width: 767px)'].display).to.equal('block');
    const result2 = hide({}, null, 'block');
    expect(result2['.show-md']['@media (max-width: 1023px)'].display).to.equal('block');
    expect(result2['.show-sm']['@media (max-width: 767px)'].display).to.equal('block');
    done();
  });
});

describe('input', function() {
  it('generates input classes', (done) => {
    const inputs = require('../styles/mixins/inputs.js')(conf);
    const result = inputs({});
    compare(result, 'inputs.js');
    done();
  });
});

describe('links', function() {
  it('generates links classes', (done) => {
    const link = require('../styles/mixins/link.js')(conf);
    const result = link({}, '#444', '#333');
    compare(result, 'link.js');
    done();
  });
});

describe('list-inline', function() {
  it('renders a list-inline', (done) => {
    const list = require('../styles/mixins/list-inline.js')(conf);
    const result = list({}, '10px');
    compare(result, 'list-inline.js');
    done();
  });
});
describe('spacing mixin', function() {
  this.timeout(5000);
  it('generates basic css spacers', (done) => {
    const spacing = require('../styles/mixins/spacing.js')(conf);
    const result = spacing({}, 'margin', 'top', 'md');
    expect(result['margin-top']).to.equal(conf.spacing.default.md);
    const result2 = spacing({}, 'padding', 'bottom', 'none');
    expect(result2['padding-bottom']).to.equal(0);
    done();
  });
  it('generates multi-axis css spacers', (done) => {
    const spacing = require('../styles/mixins/spacing.js')(conf);
    // xaxis:
    const xaxisResult = spacing({}, 'margin', 'xaxis', 'lg');
    expect(xaxisResult['margin-xaxis']).to.equal(conf.spacing.default.lg);
    // yaxis:
    const yaxisResult = spacing({}, 'padding', 'yaxis', 'xs');
    expect(yaxisResult['padding-yaxis']).to.equal(conf.spacing.default.xs);
    // all:
    const allResult = spacing({});
    compare(allResult, 'spacing.js');
    done();
  });
  // todo: need to test with full css eval:
});
/*
todo: need to eval and verify css expressions
const executeCss = (cssExpression, callback) => {
  const cssProcessor = require('../tasks/css.js');
  // config, base, outputName, input, callback
  cssProcessor(conf, process.cwd(), 'none', cssExpression, callback);
};

it('can be executed as a @mixin', (done) => {
  // executeCss('@mixin spacing;', function(result) {
  //   // expect(result.css).to.include('margin-left');
  //   // expect(result.css).to.include('margin-right');
  //   return done();
  // });
});
*/
it('generates basic css tabs', (done) => {
  const tabs = require('../styles/mixins/tabs.js')(conf);
  const result = tabs({}, '3', '12');
  expect(result['border-radius']).to.equal('12');
  expect(result['& .tab']['& + label']['border-radius']).to.equal('12 12 0 0');
  expect(typeof result['& .tab:checked:nth-of-type(1) ~ .tab-content:nth-of-type(1)']).to.equal('object');
  expect(result['& .tab:checked:nth-of-type(2) ~ .tab-content:nth-of-type(2)'].position).to.equal('relative');
  expect(result['& .tab:checked:nth-of-type(2) ~ .tab-content:nth-of-type(2)'].transform).to.include('translateY');
  done();
});
