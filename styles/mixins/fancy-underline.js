module.exports = function() {
  return function(rule, backgroundColor, linkColor, hoverColor, offset, width, activeOffset) {
    offset = offset || 1;
    width = width || 1;
    activeOffset = activeOffset || 1;

    return {
      color: linkColor,
      'text-decoration': 'none',
      'text-shadow': `-1px -1px 0 ${backgroundColor}, 1px -1px 0 ${backgroundColor}, -1px 1px 0 ${backgroundColor}, 1px 1px 0 ${backgroundColor}`,
      'background-image': `linear-gradient(bottom, transparent, transparent ${offset}px, ${linkColor} ${offset}px, ${linkColor} ${offset + width}px, transparent ${offset + width}px)`,
      transition: 'color 200ms ease, background-image 200ms ease',
      '&:hover, &:focus': {
        color: hoverColor,
        'background-image': `linear-gradient(bottom, transparent, transparent ${offset}px, ${hoverColor} ${offset}px, ${hoverColor} ${offset + width}px, transparent ${offset + width}px)`,
      },
      '&:active': {
        color: hoverColor,
        'background-image': `linear-gradient(bottom, transparent, transparent ${offset + activeOffset}px, ${hoverColor} ${offset + activeOffset}px, ${hoverColor} ${offset + width + activeOffset}px, transparent ${offset + width + activeOffset}px)`,
      },
      '&:focus': {
        outline: 0,
        color: linkColor
      }
    };
  };
};
