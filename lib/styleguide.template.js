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
      <b> ${name}: </b>
      <div style="width: ${value}; height: 5px; background-color: black;"> </div>
      <br>
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
          <td> <span style="width: 75px; height: 75px; background-color:${value};">&nbsp&nbsp&nbsp&nbsp&nbsp  </span> </td>
          <td> ${name} </td>
          <td> ${value} </td>
          </tr>
        `;
        return memo;
      }, '')}
    </table>
    <h2> Fonts <h2>
    <h3> Font Families: </h3>
    <table>
    ${reduce(config.fonts, (memo, value, name) => {
      memo += `<tr>
       <td> ${name} : </td>
       <td style="height:50px; width: 50px; font-family:${value}">  ${value} </td>
      </tr>
       `;
      return memo;
    }, '')}
    </table>
    <h3> Font Styles: </h3>
    ${reduce(config.fontStyles, (memo, value, name) => {
      memo += printFont(name, value);
      return memo;
    }, '')}
    <h2> Breakpoints <h2>
      ${reduce(config.breakpoints, (memo, value, name) => {
          memo += `
          <table>
            <tr>
              <td> <b> ${name}</b> </td>
              <td> ${reduce(value, (memo2, cssValue, cssProperty) => {
                memo2 += ` ${cssProperty}: ${cssValue};`;
                return memo2;
              },'')} </td>
            </tr>
          </table>
          `;
        return memo;
      }, '')}
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
      ${reduce(config.spacing, (memo, value, name) => {
        memo += printSpace(value, name);
        return memo;
      }, '')}
  </body>
</html>
`;
};
