'use strict';
const _ = require('lodash');
const seenVars = {};
const fontCategories = ['h1', 'h2', 'h3', 'h4', 'h5', 'body', 'large', 'small'];

const printFont = (fontName, fontValue) => {
  let result = '';
  _.each(fontCategories, (category) => {
    result += `<${category} style="font-family: ${fontValue};"> ${fontName} ${category} </${category}>`;
  });
  return result;
};

module.exports = (cssVars) => {
return `
<html>
  <head> </head>
  <body>
    <h1> Styleguide </h1>
    <h2> Colors <h2>
    <table>
      ${_.reduce(cssVars, (memo, value, name) => {
        if (_.startsWith(name, 'color')) {
          seenVars[name] = true;
          memo += `
          <tr>
          <td> ${name} </td>
          <td> ${value} </td>
          <td> <span style="background-color:${value};">&nbsp&nbsp&nbsp&nbsp&nbsp  </span> </td>
          </tr>
          `;
        }
        return memo;
      }, '')}
    </table>
    <h2> Breakpoints <h2>
    <table>
      ${_.reduce(cssVars, (memo, value, name) => {
        if (_.startsWith(name, 'breakpoint')) {
          seenVars[name] = true;
          memo += `
          <tr>
          <td> ${name} </td> <td> <hr style="border-top: 1px solid #aaaaaa; border-bottom: 1px solid #ffffff; width: ${value}"> ${value} <br> </td>
          </tr>
          `;
        }
        return memo;
      }, '')}
    </table>
    <h2> Spacing <h2>
    <table>
      ${_.reduce(cssVars, (memo, value, name) => {
        if (_.startsWith(name, 'spacing')) {
          seenVars[name] = true;
          memo += `
          <tr>
          <td> ${name} </td> <td> <hr style="border-top: 1px solid #aaaaaa; border-bottom: 1px solid #ffffff; width: ${value}"> ${value} <br> </td>
          </tr>
          `;
        }
        return memo;
      }, '')}
    </table>
    <h2> Grid <h2>
    <table>
      ${_.reduce(cssVars, (memo, value, name) => {
        if (_.startsWith(name, 'grid')) {
          seenVars[name] = true;
          memo += `
          <tr>
          <td> ${name} </td> <td> <hr style="border-top: 1px solid #aaaaaa; border-bottom: 1px solid #ffffff; width: ${value}"> ${value} <br> </td>
          </tr>
          `;
        }
        return memo;
      }, '')}
    </table>
    <h2> Fonts <h2>
    ${_.reduce(cssVars, (memo, value, name) => {
      if (_.startsWith(name, 'font')) {
        seenVars[name] = true;
        memo += printFont(name, value);
      }
      return memo;
    }, '')}
    <h2> Variables </h2>
    <table>
      ${_.reduce(cssVars, (memo, value, name) => {
        if (!seenVars[name]) {
          memo += `
          <tr>
          <td> ${name} </td> <td> ${value} </td>
          </tr>
          `;
        }
        return memo;
      }, '')}
    </table>
  </body>
</html>

`;
};
