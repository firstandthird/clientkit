'use strict';
const fs = require('fs');

module.exports = (styleConfig, inputName, outputName, log) => {
  try {
    const htmlTemplate = require(inputName);
    const output = htmlTemplate(styleConfig);
    fs.writeFileSync(outputName, output);
    log(`styleguide available at ${outputName}`);
  } catch (e) {
    log(e);
  }
};
