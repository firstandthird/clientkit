'use strict';
const ejs = require('ejs');
const ext = require('object-assign');
const fs = require('fs');
const path = require('path');
const fontColorContrast = require('font-color-contrast');
const template = require('lodash.template');
const fontContrast = function(color) {
  //HACK: check if shorthand (#fff)
  if (color.length === 4) {
    color = `${color}${color[3]}${color[3]}${color[3]}`
  }
  return fontColorContrast(color);
}

module.exports = function (themeopts) {
  // set theme options object
  themeopts = Object(themeopts);

  // set theme logo
  themeopts.logo = themeopts.logo || 'mdcss-logo.png';

  // set theme title
  themeopts.title = themeopts.title || 'Style Guide';

  // set theme css
  themeopts.css = themeopts.css || ['primer.css', 'style.css'];

  // set theme css
  themeopts.js = themeopts.js || [];

  // set theme masthead color
  themeopts.color = themeopts.color || ['#4078c0'];

  // set navigation links
  themeopts.nav = themeopts.nav || [];

  // set example conf
  themeopts.examples = ext({
    base:    '',
    target:  '_self',
    css:     ['style.css'],
    js:      [],
    bodyjs:  [],
    htmlcss: 'background:none;border:0;clip:auto;display:block;height:auto;margin:0;padding:0;position:static;width:auto',
    bodycss: 'background:none;border:0;clip:auto;display:block;height:auto;margin:0;padding:16px;position:static;width:auto'
  }, themeopts.examples);

  // return theme
  return function (docs) {
    // set assets directory and template
    docs.assets   = path.join(__dirname, 'assets');
    docs.template = path.join(__dirname, 'template.ejs');

    // set theme options
    docs.themeopts = themeopts;

    if (themeopts.colors) {
      const styleguide = {
        title: 'Styleguide',
        name: 'styleguide',
        children: []
      }
      const groupColors = (unsortedColors) => {
        const groups = {};
        Object.keys(unsortedColors).forEach((colorName) => {
          const colorValue = unsortedColors[colorName];
          if (!groups[colorValue]) {
            groups[colorValue] = [colorName];
          } else {
            groups[colorValue].push(colorName);
          }
        });
        return groups;
      };
      const groupedColors = groupColors(themeopts.colors);
      styleguide.children.push({
        section: 'Styleguide',
        title: 'Colors',
        name: 'colors',
        content: Object.keys(groupedColors).map((colorValue) => {
          const colorData = groupedColors[colorValue];
          const strings = colorData.join('<br>');
          return `<div class="color-swatch" style="background-color: ${colorValue}; color: ${fontContrast(colorValue)}; display: inline-block; height: 200px; width: 200px;">
            <div class="color-value">${colorValue}</div>
            <div class="color-name" style="display: table-cell;  vertical-align:bottom; ">
               ${strings}
            </div>
           </div>`;
        })
      });
      docs.list.unshift(styleguide);
    }
    if (themeopts.variables) {
      const variables = {
        title: 'Variables',
        name: 'variables',
        children: []
      };
      variables.children.push({
        section: 'Variables',
        title: 'CSS',
        name: 'css',
        content: `<pre class="highlight"><code>${Object.keys(themeopts.variables).map((key) => (
          `${key}: ${themeopts.variables[key]}`
        )).join('\n')}</code></pre>`
      });
      docs.list.push(variables);
    }
    if (themeopts.sectionOrder) {
      Object.keys(themeopts.sectionOrder).forEach((sectionName) => {
        docs.list.forEach((section) => {
          if (section.title === sectionName) {
            section.order = themeopts.sectionOrder[sectionName];
          }
        });
      });
    }

    // return promise
    return new Promise(function (resolve, reject) {
      // read template
      fs.readFile(docs.template, 'utf8', function (error, contents) {
        // throw if template could not be read
        if (error) reject(error);
        else {
          // set examples options
          docs.opts = ext({}, docs.opts, docs.themeopts);

          // set compiled template
          docs.template = template(contents)(docs);

          // resolve docs
          resolve(docs);
        }
      });
    });
  };
};

module.exports.type = 'mdcss-theme';
