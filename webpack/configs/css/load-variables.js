const addVarObject = (curVarName, curVarValue, curObject) => {
  if (typeof curVarValue === 'object') {
    // for each key in the object, set object recursively:
    Object.keys(curVarValue).forEach((nextVarName) => {
      addVarObject(`${curVarName}-${nextVarName}`, curVarValue[nextVarName], curObject);
    });
    return;
  }
  curObject[curVarName] = curVarValue;
};

module.exports = config => {
  const cssVars = {};

  if (config.color) {
    Object.keys(config.color).forEach(color => {
      cssVars[`--color-${color}`] = config.color[color];
    });
  }

  if (typeof config.spacing === 'object' && config.spacing.default) {
    Object.keys(config.spacing.default).forEach(spacing => {
      cssVars[`--spacing-${spacing}`] = config.spacing.default[spacing];
    });
  }

  if (config.grid) {
    Object.keys(config.grid).forEach(prop => {
      cssVars[`--grid-${prop}`] = config.grid[prop];
    });
  }

  if (config.vars) {
    Object.keys(config.vars).forEach(varName => {
      addVarObject(`--${varName}`, config.vars[varName], cssVars);
    });
  }

  if (config.breakpoints) {
    Object.keys(config.breakpoints).forEach(breakpoint => {
      cssVars[`--breakpoint-${breakpoint}`] = config.breakpoints[breakpoint]['max-width'];
    });
  }

  return cssVars;
};
