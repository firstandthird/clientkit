const path = require('path');

const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';
const prefix = process.env.CK_PREFIX || 'clientkit';
const baseConfig = process.env.CK_BASE_CONFIG || path.join(__dirname, 'conf');
const primaryConfig = process.env.CK_CONFIG || path.join(process.cwd(), prefix);
const clientkitPath = process.env.CK_PATH || __dirname;

module.exports = {
  env,
  isProduction,
  prefix,
  clientkitPath,
  baseConfig,
  primaryConfig
};
