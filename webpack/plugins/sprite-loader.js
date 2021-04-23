const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');

module.exports = new SVGSpritemapPlugin({
  plainSprite: true,
  spriteAttrs: {
    width: '0',
    height: '0',
    style: 'position:absolute;'
  }
});
