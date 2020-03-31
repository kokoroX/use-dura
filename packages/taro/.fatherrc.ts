import path from 'path';

const extraBabelPlugins = [['babel-plugin-module-resolver', { root: ['.'], alias: { 'react': 'adapter-taro' } }]];

export default {
  runtimeHelpers: false,
  extraBabelPlugins,
}