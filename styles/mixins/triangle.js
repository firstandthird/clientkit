'use strict';

module.exports = function( config ) {
  return function( mixin, size, direction ) {
    if ( ! size ) {
      size = '4px';
    }
    let borders;
    const styles = {
      'display' : 'inline-block',
      'width' : 0,
      'height' : 0,
      'vertical-align' : 'middle',
      'content' : '""'
    };

    if ( ! direction || 'down' === direction ) {
      borders = {
        'border-top' : size + ' solid',
        'border-right' : size + ' solid transparent',
        'border-left' : size + ' solid transparent'
      };
    }
    if ( 'up' === direction ) {
      borders = {
        'border-bottom' : size + ' solid',
        'border-right' : size + ' solid transparent',
        'border-left' : size + ' solid transparent'
      };
    }
    if ( 'right' === direction ) {
      borders = {
        'border-left' : size + ' solid',
        'border-top' : size + ' solid transparent',
        'border-bottom' : size + ' solid transparent'
      };
    }
    if ( 'left' === direction ) {
      borders = {
        'border-right' : size + ' solid',
        'border-top' : size + ' solid transparent',
        'border-bottom' : size + ' solid transparent'
      };
    }

    return Object.assign( styles, borders );
  };
};
