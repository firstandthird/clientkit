'use strict';

const Logr = require('logr');
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const _ = require('lodash');

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

const log = new Logr({
  type: 'cli',
  renderOptions: {
    cli: {
      lineColor: 'yellow'
    }
  }
});

const assetName = function(assetMap, name) {
  if (assetMap[name]) {
    return assetMap[name];
  }

  return '';
};

module.exports = function(fileHash, conf, cb) {
  if (!conf.core.urlHashing.inject) {
    return cb(null);
  }
  const distDir = conf.core.dist;
  const prefix = conf.core.urlHashing.inject.prefix;

  if (prefix) {
    fileHash = _.mapValues(fileHash, value => `${prefix}${value}`);
  }
  glob(conf.core.urlHashing.inject.files, (err, files) => {
    if (err) {
      log('Error finding injection files');
      return cb(null);
    }
    files.forEach((file) => {
      const contentString = fs.readFileSync(file).toString();
      const compiled = _.template(contentString, { imports: { assetName } });

      const dir = path.dirname(`${distDir}/${file}`);
      mkdirp.sync(dir);

      fs.writeFileSync(`${distDir}/${file}`, compiled({ assetMap: fileHash }));
    });
    cb(null);
  });
};
