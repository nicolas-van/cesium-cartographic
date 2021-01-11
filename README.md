# cesium-cartographic
Math helper extensions for cartographic calculation in Cesium.js

## Installation

```
npm install --save cesium cesium-cartographic
```

## Usage

```
import * as cc from 'cesium-cartographic`
import * as Cesium from 'cesium'

cc.greatCircleGroundDistance(Cesium.Cartographic.fromDegrees(0, 0, 0), Cesium.Cartographic.fromDegrees(1, 1, 0))
```

[See the documentation for the rest.](https://nicolas-van.github.io/cesium-cartographic/)
