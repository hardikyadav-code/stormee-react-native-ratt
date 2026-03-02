// const path = require('path');
// const { getDefaultConfig } = require('@react-native/metro-config');
// const { withMetroConfig } = require('react-native-monorepo-config');

// const root = path.resolve(__dirname, '..');

// /**
//  * Metro configuration
//  * https://facebook.github.io/metro/docs/configuration
//  *
//  * @type {import('metro-config').MetroConfig}
//  */
// const config = withMetroConfig(getDefaultConfig(__dirname), {
//   root,
//   dirname: __dirname,
// });

// module.exports = config;

const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');
const { withMetroConfig } = require('react-native-monorepo-config');
const nodeLibs = require('node-libs-react-native');

const root = path.resolve(__dirname, '..');

// 👇 YOUR ACTUAL LOCAL LIB PATH
const localRattLibPath = '/Users/hardikyadav/Ratt-UI-Lib';

const config = withMetroConfig(getDefaultConfig(__dirname), {
  root,
  dirname: __dirname,
});

// 🚀 Tell Metro to watch your linked library
config.watchFolders = [root, localRattLibPath];

// 🚀 Polyfills
config.resolver = config.resolver || {};
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  ...nodeLibs,
};

// 🚀 VERY IMPORTANT: prevent duplicate react/react-native
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(localRattLibPath, 'node_modules'),
];

module.exports = config;
