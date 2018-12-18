const tap = require('tap');
const utils = require('./utils');
const assets = require('./out/assets');

tap.test('Assets', t => {
  t.ok(typeof assets['full.css'] !== 'undefined', 'Full file is hashed');
  t.ok(typeof assets['slim.css'] !== 'undefined', 'Slim file is hashed');
  t.end();
});

tap.test('Full', t => {
  utils.checkOutput(t, assets['full.css'], 'full.css');
  t.end();
});

tap.test('Slim', t => {
  utils.checkOutput(t, assets['slim.css'], 'slim.css');
  t.end();
});
