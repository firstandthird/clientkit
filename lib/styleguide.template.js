'use strict';
const reduce = require('lodash.reduce');
const capitalize = require('lodash.capitalize');
const colorParser = require('parse-color');

// get an object of colors mapped to their equivalent value:
const groupColors = (colors) => {
  return reduce(colors, (memo, colorValue, colorName) => {
    // the key for a given color is the string "R,G,B,A":
    const parsedValue = colorParser(colorValue).rgba.join(',');
    if (memo[parsedValue]) {
      memo[parsedValue].push(colorName);
    } else {
      memo[parsedValue] = [colorName];
    }
    return memo;
  }, {});
};

const printColors = (colors) => {
  const colorDictionary = groupColors(colors);
  let colorList = '';
  Object.keys(colorDictionary).sort((a,b) => {
    const aV = reduce(a.split(','), (total, channelValue) => {
      return total + parseInt(channelValue, 10);
    }, 0) / 4;
    const bV = reduce(b.split(','), (total, channelValue) => {
      return total + parseInt(channelValue, 10);
    }, 0) / 4;
    if (aV > bV) {
      return 1;
    }
    if (bV > aV) {
      return -1;
    }
    return 0;
  }).forEach((colorValue) => {
    // print one color swatch
    colorList += `
    <li style="color: white; background-color:rgba(${colorValue});">
    <h3>
    RGBA: ${colorValue}:
    </h3>
      <span style="display: table-cell; vertical-align: bottom;  width: 200px; height: 200px;">
    `;
    // print all the colr names for this swatch:
    colorDictionary[colorValue].forEach((colorName) => {
      colorList += `
        ${colorName} <br>
      `;
    });
    colorList += `
      </span>
    </li>`;
  });
  return colorList;
};
const printFont = (fontCategory, fontData) => {
  let result = `<tr><td>${fontCategory}</td><td>`;
  result += reduce(fontData, (memo, fontDefinition, name) => {
    memo += `<div class="${name}"> ${capitalize(name.replace(/-/g, ' '))}</div>`;
    return memo;
  }, '');
  result += '</td></tr>';
  return result;
};

const printVariables = (vars) => {
  if (!vars || Object.keys(vars).length === 0) {
    return '';
  }
  return `
      <h2>Variables</h2>
      <table>
        ${reduce(vars, (memo, value, name) => {
          memo += `
            <tr>
            <td>${name}</td><td>${value}</td>
            </tr>
          `;
          return memo;
        }, '')}
      </table>
`;
};

module.exports = (config) => {
  const head = reduce(config.stylesheets, (memo, stylesheet, stylesheetName) => {
    memo += `<link rel="stylesheet" type="text/css" href="${stylesheetName}"></link>`;
    return memo;
  }, '');
  return `
<html>
  <head>
    ${head}
    <style>
      table {
        width: 100%;
        border-collapse: collapse;
      }
      td {
        border: 1px solid #f0f0f0;
        padding: 5px;
        width: 50%;
      }
      h2 {
        margin-top: 50px;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #333;
      }
    </style>
  </head>
  <body>
    <h1>Styleguide</h1>
    <h2>Colors</h2>
    <ul class="list-inline" style="padding: .2em;">
    ${printColors(config.color)}
    </ul>
    <h2>Fonts</h2>
    <h3>Font Families:</h3>
    <table>
    ${reduce(config.fonts, (memo, value, name) => {
      memo += `<tr>
       <td>${name}:</td>
       <td><span style="font-family:${value}">${value}</span></td>
      </tr>
       `;
      return memo;
    }, '')}
    </table>
    <h3>Font Styles:</h3>
    <table>
    ${reduce(config.fontStyles, (memo, value, name) => {
      memo += printFont(name, value);
      return memo;
    }, '')}
    </table>
    <h2>Breakpoints</h2>
    <table>
      <tr>
        <td>Site Max Width</td>
        <td>${config.core.siteMaxWidth || 'None' }</td>
      </tr>
      <tr>
        <td>Mobile First</td>
        <td>${(config.core.mobileFirst) ? 'Yes' : 'No' }</td>
      </tr>
      ${reduce(config.breakpoints, (memo, value, name) => {
          memo += `
            <tr>
              <td>${name}</td>
              <td>${reduce(value, (memo2, cssValue, cssProperty) => {
                memo2 += `${cssProperty}: ${cssValue}<br/>`;
                return memo2;
              },'')} </td>
            </tr>
          `;
        return memo;
      }, '')}
    </table>
    ${printVariables(config.vars)}
    <h2>Spacing</h2>
    <table>
      ${reduce(config.spacing.default, (memo, value, name) => {
        memo += `
          <tr><td>${name}</td><td>${value}</td></tr>
        `;
        return memo;
      }, '')}
    </table>
  </body>
</html>
`;
};
