module.exports = function (config) {
  return function () {
    const styles = {};
    const breakpoints = Object.keys(config.breakpoints);
    const cols = 12;

    for (const breakpoint of breakpoints) {
      const bp = `@media (min-width: ${config.breakpoints[breakpoint]['min-width']})`;
      const colName = config.breakpoints[breakpoint].col;
      styles[bp] = {
        '.content': {
          width: config.breakpoints[breakpoint].content
        }
      };

      // If the breakpoint doesn't have a col name we shouldn't do anything
      if (!colName) {
        continue;
      }

      styles[bp][`.col-${colName}-pull-0`] = {
        right: 'auto'
      };

      styles[bp][`.col-${colName}-push-0`] = {
        left: 'auto'
      };

      styles[bp][`.col-${colName}-offset-0`] = {
        'margin-left': 'auto'
      };

      for (let i = 1; i <= cols; i++) {
        styles[bp][`.col-${colName}-${i}`] = {
          width: `${(100 / (12 / i))}%`
        };

        styles[bp][`.col-${colName}-pull-${i}`] = {
          width: `${(100 / (12 / i))}%`
        };

        styles[bp][`.col-${colName}-push-${i}`] = {
          width: `${(100 / (12 / i))}%`
        };

        styles[bp][`.col-${colName}-offset-${i}`] = {
          'margin-left': `${(100 / (12 / i))}%`
        };
      }
    }

    return styles;
  };
};
