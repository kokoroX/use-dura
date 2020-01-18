const reactBabelPlugins = [];
const taroBabelPlugins = [
  // ['babel-plugin-module-resolver', { root: ['.'], alias: { 'react': '@tarojs/taro' } }]
];
const extraBabelPlugins = process.env.BUILD_TYPE === 'react' ? reactBabelPlugins : taroBabelPlugins;

export default {
  extraBabelPlugins,
  runtimeHelpers: false,
  pkgs: [
    'types',
    'loading',
    'core',
    'immer',
    'taro'
  ]
}