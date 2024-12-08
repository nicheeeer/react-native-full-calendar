const fs = require('fs');
const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const root = path.resolve(__dirname, '..');
const rootPak = JSON.parse(
  fs.readFileSync(path.join(root, 'package.json'), 'utf8')
);

const modules = [
  '@babel/runtime',
  'metro-runtime',
  ...Object.keys({
    ...rootPak.dependencies,
    ...rootPak.peerDependencies,
  }),
];

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),
  },
  watchFolders: [root],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
