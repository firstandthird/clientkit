const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

module.exports = new SpriteLoaderPlugin({
  plainSprite: true,
  spriteAttrs: {
    width: '0',
    height: '0',
    style: 'position:absolute;'
  }
});
