'use strict';
const beforeEach = require('mocha').beforeEach;
const describe = require('mocha').describe;
const it = require('mocha').it;
const expect = require('chai').expect;
const path = require('path');

// global config object for each test
let conf;

const executeCss = (cssExpression, callback) => {
  const cssProcessor = require('../tasks/css.js');
  // config, base, outputName, input, callback
  cssProcessor(conf, process.cwd(), 'none', cssExpression, callback);
};

describe('spacing mixin', function() {
  this.timeout(5000);
  beforeEach((beforeEachDone) => {
    conf = require('confi')({
      path: [
        './conf'
      ],
      context: {
        CKDIR: __dirname,
        CONFIGDIR: path.join(process.cwd(), 'clientkit')
      }
    });
    conf.consoleOnly = true;
    beforeEachDone();
  });
  it('generates basic css spacers', (done) => {
    const spacing = require('../styles/mixins/spacing.js')(conf);
    const result = spacing({}, 'margin', 'top', 'md');
    expect(result['margin-top']).to.equal('30px');
    const result2 = spacing({}, 'padding', 'bottom', 'none');
    expect(result2['padding-bottom']).to.equal(0);
    done();
  });
  it('generates multi-axis css spacers', (done) => {
    const spacing = require('../styles/mixins/spacing.js')(conf);
    // xaxis:
    const xaxisResult = spacing({}, 'margin', 'xaxis', 'lg');
    expect(xaxisResult['margin-xaxis']).to.equal('50px');
    // yaxis:
    const yaxisResult = spacing({}, 'padding', 'yaxis', 'xs');
    expect(yaxisResult['padding-yaxis']).to.equal('10px');
    // all:
    const allResult = spacing({});
    expect(allResult['.margin-xl']['margin-top']).to.equal('80px');
    expect(allResult['.margin-xl']['margin-left']).to.equal('80px');
    expect(allResult['.margin-xl']['margin-bottom']).to.equal('80px');
    expect(allResult['.margin-xl']['margin-right']).to.equal('80px');
    expect(allResult['.margin-xaxis-xs']['margin-right']).to.equal('10px');
    done();
  });
  it('can be executed as a @mixin', (done) => {
    executeCss('@mixin spacing;', (result) => {
      expect(result.css).to.include('.padding-none');
      done();
    });
  });
});

describe('tabs mixin', function() {
  this.timeout(5000);
  beforeEach((beforeEachDone) => {
    conf = require('confi')({
      path: [
        './conf'
      ],
      context: {
        CKDIR: __dirname,
        CONFIGDIR: path.join(process.cwd(), 'clientkit')
      }
    });
    beforeEachDone();
  });
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
  // it('sets up the site-max', (done) => {
  //   executeCss('@mixin site-max;', (result) => {
  //     expect(result.css).to.include('max-width');
  //     expect(result.css).to.include(conf.siteMaxWidth);
  //     done();
  //   });
  // });
});

describe('buttons mixin', function() {
  this.timeout(20000);
  it('generates css for buttons', (done) => {
    const button = require('../styles/mixins/button.js')(conf);
    // mixin, bgColor, fgColor, type
    const result = button({}, '#ff0000', '#00ff00', 'outline');
    expect(result.color).to.equal('#ff0000');
    expect(result.border).to.equal('2px solid #ff0000');
    expect(result['&:hover'].color).to.equal('#00ff00');
    done();
  });
});

describe('font-style', function() {
  it('generates a group of font classes', (done) => {
    const font = require('../styles/mixins/font-style.js')(conf);
    const result = font({});
    expect(result['.heading-3']['font-family']).to.equal('sans');
    expect(result['.heading-3']['font-size']).to.equal('25px');
    expect(result['.font-large']['font-size']).to.equal('16px');
    done();
  });

  it('generates a sized font class', (done) => {
    const font = require('../styles/mixins/font-style.js')(conf);
    const result = font({}, 'font-small');
    expect(result['font-size']).to.equal('12px');
    const result2 = font({}, 'font-large');
    expect(result2['font-size']).to.equal('16px');
    done();
  });
});

describe('grid', function() {
  it('generates grid classes', (done) => {
    const grid = require('../styles/mixins/grid.js')(conf);
    const result = grid({});
    expect(result['.container'].width).to.equal('1440px');
    expect(result['.col-9'].width).to.equal('75%');
    expect(result['.col-9'].float).to.equal('left');
    expect(typeof result['@media (max-width: 1439px)']).to.equal('object');
    expect(typeof result['@media (max-width: 1023px)']).to.equal('object');
    expect(typeof result['@media (max-width: 767px)']).to.equal('object');
    expect(result['@media (max-width: 767px)'][`.col-sm-${conf.grid.columns - 1}`]['padding-left']).to.equal('15px');
    expect(result['@media (max-width: 1023px)'][`.col-md-${conf.grid.columns - 1}`]['padding-left']).to.equal('15px');
    done();
  });
});

describe('input', function() {
  it('generates input classes', (done) => {
    const inputs = require('../styles/mixins/inputs.js')(conf);
    const result = inputs({});
    expect(result['.input'].border).to.equal(conf.inputs.default.input.border);
    done();
  });
});

describe('links', function() {
  it('generates links classes', (done) => {
    const link = require('../styles/mixins/link.js')(conf);
    const result = link({}, '#444', '#333');
    expect(result.a.color).to.equal('#444');
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
