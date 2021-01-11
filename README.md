# cesium-cartographic [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Meet%20this%20awesome%20library&url=https://github.com/nicolas-van/cesium-cartographic&via=nicolasvanhoren&hashtags=cesium)

[![GitHub Repo stars](https://img.shields.io/github/stars/nicolas-van/cesium-cartographic?style=social)](https://github.com/nicolas-van/cesium-cartographic) [![Website](https://img.shields.io/website.svg?url=http%3A%2F%2Fnicolas-van.github.io%2Fcesium-cartographic)](https://nicolas-van.github.io/cesium-cartographic)
[![Node.js CI](https://github.com/nicolas-van/cesium-cartographic/workflows/Node.js%20CI/badge.svg)](https://github.com/nicolas-van/cesium-cartographic/actions) [![npm](https://img.shields.io/npm/v/cesium-cartographic)](https://www.npmjs.com/package/cesium-cartographic) [![Coverage Status](https://coveralls.io/repos/github/nicolas-van/cesium-cartographic/badge.svg?branch=master)](https://coveralls.io/github/nicolas-van/cesium-cartographic?branch=master) [![](https://data.jsdelivr.com/v1/package/npm/cesium-cartographic/badge)](https://www.jsdelivr.com/package/npm/cesium-cartographic)

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
