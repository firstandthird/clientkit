'use strict';
const hash = require('rev-hash');
const path = require('path');
const fs = require('fs');
const debounce = require('lodash.debounce');
let map = {};

module.exports.hash = (inputName, inputContent) => {
  let hashKey;
  if (typeof inputContent === 'string') {
    hashKey = hash(Buffer.from(inputContent));
  } else {
    hashKey = hash(inputContent);
  }
  const extension = path.extname(inputName);
  const basename = path.basename(inputName);
  const outputName = inputName.replace(extension, `.${hashKey}${extension}`);
  const baseOutput = basename.replace(extension, `.${hashKey}${extension}`);
  map[basename] = baseOutput;
  return outputName;
};

module.exports.writeMap = debounce((config) => {
  fs.writeFileSync(config.core.urlHashing.jsonMapping, JSON.stringify(map));
}, 1000);

module.exports.clearMap = () => {
  map = {};
};
