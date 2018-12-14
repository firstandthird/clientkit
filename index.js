const path = require('path');
const getConfig = require('./lib/get-config');

process.env.CK_PREFIX = 'default';
process.env.CK_BASE_CONFIG = path.join(__dirname, 'conf');
process.env.CK_CONFIG = path.join(__dirname, 'conf');
process.env.CK_PATH = __dirname;

module.exports = getConfig;
