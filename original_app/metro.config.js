const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, 'mp3', 'wav', 'ogg', 'm4a'],
    sourceExts: [...defaultConfig.resolver.sourceExts, 'ts', 'tsx'],
  },
};

module.exports = mergeConfig(defaultConfig, config);