const path = require('path');

const task = process.argv[2] || 'default';
const env = process.env.NODE_ENV || (task === 'prod' ? 'production' : 'development');
const isProduction = task === 'prod' || env === 'production';
const prefix = process.env.CK_PREFIX || 'clientkit';
const baseConfig = process.env.CK_BASE_CONFIG || path.join(__dirname, 'conf');
const primaryConfig = process.env.CK_CONFIG || path.join(process.cwd(), prefix);
const clientkitPath = process.env.CK_PATH || __dirname;

process.env.CK_PREFIX = prefix;
process.env.CK_BASE_CONFIG = baseConfig;
process.env.CK_CONFIG = primaryConfig;
process.env.CK_PATH = clientkitPath;

module.exports = {
  env,
  task,
  isProduction,
  prefix,
  clientkitPath,
  baseConfig,
  primaryConfig
};
