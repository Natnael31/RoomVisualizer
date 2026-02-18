// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for .pte and .bin model files
config.resolver.assetExts.push('pte');
config.resolver.assetExts.push('bin');

module.exports = config;