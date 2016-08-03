'use strict';
const reduce = require('lodash.reduce');

const printFont = (fontCategory, fontData) => {
  let result = `<h3>${fontCategory}</h3>`;
  result += reduce(fontData, (memo, fontDefinition, name) => {
    memo += `<div class="${name}"> ${name}</div>`;
    return memo;
  }, '');
  return result;
};

const printSpace = (spacingData, category) => {
  return reduce(spacingData, (memo, value, name) => {
    memo += `
      <tr>
      <td> ${name} </td> <td> <hr style="border-top: 1px solid black; border-bottom: 1px solid #ffffff; width: ${value}"> ${value} <br> </td>
      </tr>
    `;
    return memo;
  }, '');
};

module.exports = (config) => {
  const head = reduce(config.stylesheets, (memo, stylesheet, stylesheetName) => {
    memo += `<link rel="stylesheet" type="text/css" href="${stylesheetName}"> </link>`;
    return memo;
  }, '');
  return `
<html>
  <head>
    ${head}
  </head>
  <body>
    <h1> Styleguide </h1>
    <h2> Colors <h2>
    <table>
      ${reduce(config.color, (memo, value, name) => {
        memo += `
          <tr>
          <td> ${name} </td>
          <td> ${value} </td>
          <td> <span style="background-color:${value};">&nbsp&nbsp&nbsp&nbsp&nbsp  </span> </td>
          </tr>
        `;
        return memo;
      }, '')}
    </table>
    <h2> Fonts <h2>
    ${reduce(config.fontStyles, (memo, value, name) => {
      memo += printFont(name, value);
      return memo;
    }, '')}
    <h2> Breakpoints <h2>
    <table>
      ${reduce(config.breakpoints, (memo, value, name) => {
          memo += `
          <tr>
          <td> ${name} </td>
          <td> <hr style="border-top: 1px solid #aaaaaa; border-bottom: 1px solid #ffffff; width: ${value}"> ${value} <br> </td>
          </tr>
          `;
        return memo;
      }, '')}
    </table>
    <h2> Variables </h2>
    <table>
      ${reduce(config.vars, (memo, value, name) => {
        memo += `
          <tr>
          <td> ${name} = </td>  <td> ${value} </td>
          </tr>
        `;
        return memo;
      }, '')}
    </table>
    <h2> Spacing <h2>
    <table>
      ${reduce(config.spacing, (memo, value, name) => {
        memo += printSpace(value, name);
        return memo;
      }, '')}
    </table>
    <h2> Grid <h2>
    <table>
      ${reduce(config.grid, (memo, value, name) => {
        memo += `
          <tr>
          <td> ${name} </td> <td> <hr style="border-top: 1px solid black; border-bottom: 1px solid #ffffff; width: ${value}"> ${value} <br> </td>
          </tr>
        `;
        return memo;
      }, '')}
    </table>
  </body>
</html>
`;
};
