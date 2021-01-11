
import * as Cesium from 'cesium'

const MEAN_EARTH_RADIUS = 6371000

export { MEAN_EARTH_RADIUS }

/**
 * Calculates the ground distance between two geographic coordinates using the Harvesine formulae.
 *
 * @param {Cesium.Cartographic} carto1 The first cartographic coordinate.
 * @param {Cesium.Cartographic} carto2 The second cartographic coordinate.
 * @param {number} radius The radius in meters (defaults to MEAN_EARTH_RADIUS)
 * @returns {number} The distance
 */
function greatCircleGroundDistance (carto1, carto2, radius = MEAN_EARTH_RADIUS) {
  // original javascript implementation from Chris Veness : https://github.com/chrisveness/geodesy

  // a = sin²(Δφ/2) + cos(φ1)⋅cos(φ2)⋅sin²(Δλ/2)
  // δ = 2·atan2(√(a), √(1−a))
  // see mathforum.org/library/drmath/view/51879.html for derivation

  const R = radius
  const φ1 = carto1.latitude
  const λ1 = carto1.longitude
  const φ2 = carto2.latitude
  const λ2 = carto2.longitude
  const Δφ = φ2 - φ1
  const Δλ = λ2 - λ1

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c

  return d
}

export { greatCircleGroundDistance }

/**
 * Calculates the initial bearing to take to navigate from a point to another using the Harvesine formulae.
 *
 * @param {Cesium.Cartographic} carto1 The first cartographic coordinate.
 * @param {Cesium.Cartographic} carto2 The second cartographic coordinate.
 * @returns {number} The initial bearing in radians (0° = North, 90° = East, 270° = West)
 */
function greatCircleInitialBearing (carto1, carto2) {
  // original javascript implementation from Chris Veness : https://github.com/chrisveness/geodesy

  // tanθ = sinΔλ⋅cosφ2 / cosφ1⋅sinφ2 − sinφ1⋅cosφ2⋅cosΔλ
  // see mathforum.org/library/drmath/view/55417.html for derivation

  const φ1 = carto1.latitude
  const φ2 = carto2.latitude
  const Δλ = carto2.longitude - carto1.longitude

  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
  const y = Math.sin(Δλ) * Math.cos(φ2)
  const θ = Math.atan2(y, x)

  return Cesium.Math.zeroToTwoPi(θ)
}

export { greatCircleInitialBearing }

/**
 * Travels a distance from a given point using a distance and a bearing and returns the new point.
 *
 * @param {Cesium.Cartographic} carto The initial cartographic coordinate
 * @param {number} distance The distance to travel in meters
 * @param {number} initialBearing The initial bearing in radians
 * @param {number} radius The radius in meters (defaults to MEAN_EARTH_RADIUS)
 * @returns {Cesium.Cartographic} The new position
 */
function greatCircleDestination (carto, distance, initialBearing, radius = MEAN_EARTH_RADIUS) {
  // original javascript implementation from Chris Veness : https://github.com/chrisveness/geodesy

  // sinφ2 = sinφ1⋅cosδ + cosφ1⋅sinδ⋅cosθ
  // tanΔλ = sinθ⋅sinδ⋅cosφ1 / cosδ−sinφ1⋅sinφ2
  // see mathforum.org/library/drmath/view/52049.html for derivation

  const δ = distance / radius // angular distance in radians
  const θ = initialBearing

  const φ1 = carto.latitude
  const λ1 = carto.longitude

  const sinφ2 = Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ)
  const φ2 = Math.asin(sinφ2)
  const y = Math.sin(θ) * Math.sin(δ) * Math.cos(φ1)
  const x = Math.cos(δ) - Math.sin(φ1) * sinφ2
  const λ2 = λ1 + Math.atan2(y, x)

  const lat = φ2
  const lon = λ2

  return new Cesium.Cartographic(lon, lat, 0)
}

export { greatCircleDestination }
