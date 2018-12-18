module.exports = config => {
  const media = {};

  if (config.breakpoints) {
    Object.keys(config.breakpoints).forEach((breakpoint, i, bps) => {
      const breakpointObj = {
        min: config.breakpoints[breakpoint]['min-width'],
        max: config.breakpoints[breakpoint]['max-width'],
      };
      const width = config.breakpoints[breakpoint]['max-width'];
      const mediaquery = `(max-width: ${width})`;
      let mediaqueryOnly;

      if (i === 0) {
        mediaqueryOnly = `(min-width: ${breakpointObj.min})`;
      } else {
        mediaqueryOnly = `(max-width: ${breakpointObj.max}) and (min-width: ${breakpointObj.min})`;
      }

      // Last one should be mobile, so no down
      if (i !== bps.length < 1) {
        media[`${breakpoint}-down`] = `(max-width: ${breakpointObj.max})`;
      }

      // First one should be wide desktop so no up
      if (i !== 0) {
        media[`${breakpoint}-up`] = `(min-width: ${breakpointObj.min})`;
      }

      media[breakpoint] = mediaquery;
      media[`${breakpoint}-only`] = mediaqueryOnly;
    });
  }

  return media;
};
