'use strict';
const fs = require('fs');
module.exports = (config, inputName, outputName, log) => {
  try {
    const htmlTemplate = require(inputName);
    const output = htmlTemplate(config);
    fs.writeFileSync(outputName, output);
    log(`styleguide available at ${outputName}`);
  } catch (e) {
    console.log(e)
    log(e);
  }
};
