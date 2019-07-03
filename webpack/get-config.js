/* eslint-disable no-console */
const path = require('path');

const loadConfi = require('./load-confi');
const paths = require('../paths');
const { cleanOutput } = require('./plugins');
const compilerConfigs = require('./configs');
const mergeOptions = require('merge-options');

const getConfig = async () => {
  const config = await loadConfi();

  const commonConfig = {
    mode: paths.env,
    resolveLoader: {
      modules: [
        path.resolve(__dirname, '../node_modules'),
        'node_modules'
      ],
      extensions: ['.js', '.json'],
      mainFields: ['loader', 'main']
    },
    resolve: {
      modules: [
        paths.clientkitPath,
        path.resolve(process.cwd(), 'node_modules'),
        path.resolve(__dirname, '../node_modules')
      ],
      alias: {
        lib: path.resolve(__dirname, '../node_modules')
      }
    },
    optimization: {
      minimize: config.minify || paths.isProduction,
      nodeEnv: paths.env,
      noEmitOnErrors: true
    },
    target: 'web',
    watch: paths.task === 'dev'
  };

  const compilers = [];

  if (config.svgsprite && config.svgsprite.files) {
    const svgConfig = mergeOptions({}, commonConfig, compilerConfigs.svg(config));
    compilers.push(svgConfig);

    console.log('Loading SVGSprite Compiler');
    console.log('[SVG] Dist folder "%s"', config.svgsprite.dist);
  }

  if (config.scripts && config.scripts.files) {
    const jsConfig = mergeOptions({}, commonConfig, compilerConfigs.js(config));
    compilers.push(jsConfig);

    console.log('Loading JS Compiler');
    console.log('[JS] Dist folder "%s"', config.scripts.dist);
  }

  if (config.stylesheets && config.stylesheets.files) {
    const cssConfig = mergeOptions({}, commonConfig, compilerConfigs.css(config));
    compilers.push(cssConfig);

    console.log('Loading CSS Compiler');
    console.log('[CSS] Dist folder "%s"', config.stylesheets.dist);
  }

  console.log('Paths config:');
  console.table(paths);

  // Clean dist directories before compiling
  if (compilers.length) {
    const firstCompilerPlugins = compilers[0].plugins;

    if (firstCompilerPlugins && firstCompilerPlugins.length) {
      firstCompilerPlugins.unshift(cleanOutput());
    } else {
      compilers[0].plugins = [cleanOutput()];
    }
  }

  return { compilers, config };
};

module.exports = getConfig;
