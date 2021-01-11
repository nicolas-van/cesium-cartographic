
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default [{
  input: 'src/cesium-cartographic.mjs',
  external: ['cesium'],
  output: {
    file: 'dist/cesium-cartographic.cjs',
    format: 'cjs'
  },
  plugins: []
}, {
  input: 'src/cesium-cartographic.mjs',
  external: ['cesium'],
  output: {
    file: 'dist/cesium-cartographic.umd.js',
    format: 'umd',
    name: 'cesiumCartographic',
    globals: {
      cesium: 'Cesium'
    }
  },
  plugins: [
    nodeResolve(),
    commonjs()
  ]
}]
