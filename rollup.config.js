
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default [{
  input: 'src/cesium-cartographic.mjs',
  external: ['cesium', 'nanoassert'],
  output: {
    file: 'dist/cesium-cartographic.cjs',
    format: 'cjs'
  },
  plugins: []
}, {
  input: 'src/cesium-cartographic.mjs',
  external: [],
  output: {
    file: 'dist/cesium-cartographic.umd.js',
    format: 'umd',
    name: 'cesiumCartographic'
  },
  plugins: [
    nodeResolve(),
    commonjs()
  ]
}]
