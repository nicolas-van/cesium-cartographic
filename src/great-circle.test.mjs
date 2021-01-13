
import * as gc from './great-circle.mjs'
import { expect, test } from '@jest/globals'
import * as Cesium from 'cesium'

const expectSameCarto = (carto1, carto2) => {
  const c1 = Cesium.Cartographic.toCartesian(carto1)
  const c2 = Cesium.Cartographic.toCartesian(carto2)
  expect(Cesium.Cartesian3.distance(c1, c2)).toBeCloseTo(0, 3)
}

test('great-circle bearing', async () => {
  expect(gc.greatCircleInitialBearing(Cesium.Cartographic.fromDegrees(0, 0, 0), Cesium.Cartographic.fromDegrees(0, 10, 0))).toBeCloseTo(0, 5)
  expect(gc.greatCircleInitialBearing(Cesium.Cartographic.fromDegrees(0, 0, 0), Cesium.Cartographic.fromDegrees(10, 0, 0))).toBeCloseTo(Math.PI / 2, 5)
  expect(gc.greatCircleInitialBearing(Cesium.Cartographic.fromDegrees(0, 0, 0), Cesium.Cartographic.fromDegrees(0, -10, 0))).toBeCloseTo(Math.PI, 5)
  expect(gc.greatCircleInitialBearing(Cesium.Cartographic.fromDegrees(0, 0, 0), Cesium.Cartographic.fromDegrees(-10, 0, 0))).toBeCloseTo(Math.PI * (3 / 2), 5)
})

test('great-circle triplet', async () => {
  const carto1 = Cesium.Cartographic.fromDegrees(0, 0, 0)
  const carto2 = Cesium.Cartographic.fromDegrees(10, 10, 0)

  const b = gc.greatCircleInitialBearing(carto1, carto2)
  expect(b).toBeCloseTo(Math.PI / 4, 1)
  const d = gc.greatCircleGroundDistance(carto1, carto2)
  expect(d).toBeCloseTo(1568520.556798576, 5)

  const cartoB = gc.greatCircleTranslate(carto1, [d, b])
  expectSameCarto(cartoB, carto2)
  const nb = gc.greatCircleInitialBearing(carto2, carto1)
  const cartoC = gc.greatCircleTranslate(carto2, [d, nb])
  expectSameCarto(cartoC, carto1)
})

test('great-circle translation', async () => {
  const carto1 = Cesium.Cartographic.fromDegrees(0, 0, 0)
  const carto2 = Cesium.Cartographic.fromDegrees(10, 10, 0)

  const t = gc.greatCircleTranslation(carto1, carto2)
  expect(t[0]).toBeCloseTo(gc.greatCircleGroundDistance(carto1, carto2), 9)
  expect(t[1]).toBeCloseTo(gc.greatCircleInitialBearing(carto1, carto2), 9)

  const cartoB = gc.greatCircleTranslate(carto1, t)
  expectSameCarto(cartoB, carto2)
  const nt = gc.greatCircleTranslation(carto2, carto1)
  expect(nt[0]).toBeCloseTo(gc.greatCircleGroundDistance(carto2, carto1), 9)
  expect(nt[1]).toBeCloseTo(gc.greatCircleInitialBearing(carto2, carto1), 9)
  expect(nt[0]).toBeCloseTo(t[0], 9)
  const cartoC = gc.greatCircleTranslate(carto2, [t[0], nt[1]])
  expectSameCarto(cartoC, carto1)
})

test('great-circle no move', async () => {
  const carto1 = Cesium.Cartographic.fromDegrees(0, 0, 0)

  const t = gc.greatCircleTranslation(carto1, carto1)
  expect(t[0]).toBeCloseTo(0, 9)

  const carto2 = gc.greatCircleTranslate(carto1, t)
  expectSameCarto(carto1, carto2)
})
