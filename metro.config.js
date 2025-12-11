// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// 禁用 web 平台的 Hermes 引擎
config.resolver = {
  ...config.resolver,
  sourceExts: [...(config.resolver?.sourceExts || []), 'web.js', 'web.jsx', 'web.ts', 'web.tsx'],
};

config.transformer = {
  ...config.transformer,
  getTransformOptions: async (entryPoints, options) => {
    // 如果是 web 平台，禁用 Hermes
    if (options?.platform === 'web') {
      return {
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      };
    }
    return {
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    };
  },
};

module.exports = config;

