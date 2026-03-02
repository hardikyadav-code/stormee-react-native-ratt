// module.exports = {
//   overrides: [
//     {
//       exclude: /\/node_modules\//,
//       presets: ['module:react-native-builder-bob/babel-preset'],
//     },
//     {
//       include: /\/node_modules\//,
//       presets: ['module:@react-native/babel-preset'],
//     },
//   ],
// };

module.exports = {
  overrides: [
    {
      exclude: /\/node_modules\//,
      presets: ['module:react-native-builder-bob/babel-preset'],
    },
    {
      include: /\/node_modules\//,
      presets: ['module:@react-native/babel-preset'],
    },
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          // 🚀 THE BYPASS: Point directly to the raw React Native source code!
          // Metro will transpile this on the fly, completely bypassing the broken 'dist' folder.
          'ratt-lib': '/Users/hardikyadav/Ratt-UI-Lib/src/rn/index.ts',
        },
      },
    ],
  ],
};
