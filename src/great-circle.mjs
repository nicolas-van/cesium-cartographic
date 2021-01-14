
import * as Cesium from 'cesium'
import assert from 'nanoassert'

const MEAN_EARTH_RADIUS = 6371000

export { MEAN_EARTH_RADIUS }

/**
 * Calculates the ground distance between two geographic coordinates using the Harvesine formulae.
 *
 * @param {Cesium.Cartographic} carto1 The first cartographic coordinate.
 * @param {Cesium.Cartographic} carto2 The second cartographic coordinate.
 * @param {number} radius The radius in meters (defaults to MEAN_EARTH_RADIUS)
 * @returns {number} The distance in meters
 */
function greatCircleGroundDistance (carto1, carto2, radius = MEAN_EARTH_RADIUS) {
  assert(carto1, 'carto1 must be defined')
  assert(carto2, 'carto2 must be defined')
  assert(typeof radius === 'number', 'radius must be a number')
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

  const a = Math.pow(Math.sin(Δφ / 2), 2) + Math.cos(φ1) * Math.cos(φ2) * Math.pow(Math.sin(Δλ / 2), 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c

  return d
}

export { greatCircleGroundDistance }

/**
 * Calculates the initial bearing to take to navigate from a point to another using the Harvesine formulae.
 *
 * @param {Cesium.Cartographic} carto1 The first cartographic coordinate
 * @param {Cesium.Cartographic} carto2 The second cartographic coordinate
 * @returns {number} The initial bearing in radians (0° = North, 90° = East, 270° = West)
 */
function greatCircleInitialBearing (carto1, carto2) {
  assert(carto1, 'carto1 must be defined')
  assert(carto2, 'carto2 must be defined')
  // original javascript implementation from Chris Veness : https://github.com/chrisveness/geodesy

  // tanθ = sinΔλ⋅cosφ2 / cosφ1⋅sinφ2 − sinφ1⋅cosφ2⋅cosΔλ
  // see mathforum.org/library/drmath/view/55417.html for derivation

  const φ1 = carto1.latitude
  const φ2 = carto2.latitude
  const Δλ = carto2.longitude - carto1.longitude

  const cosφ2 = Math.cos(φ2)

  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * cosφ2 * Math.cos(Δλ)
  const y = Math.sin(Δλ) * cosφ2
  const θ = Math.atan2(y, x)

  return Cesium.Math.zeroToTwoPi(θ)
}

export { greatCircleInitialBearing }

/**
 * Calculates the end bearing of a trajectory that would go from one point to another using the Harvesine formulae.
 *
 * @param {Cesium.Cartographic} carto1 The first cartographic coordinate
 * @param {Cesium.Cartographic} carto2 The second cartographic coordinate
 * @returns {number} The end bearing in radians (0° = North, 90° = East, 270° = West)
 */
function greatCircleEndBearing (carto1, carto2) {
  /*
    The usual algorithm gives strange results when carto1 === carto2 or for very small distances. In these cases the initial
    bearing and the end bearing can be complete opposites. This behavior is not important for most applications can be critical if
    we try to compare the initial bearing and the end bearing. We solve this problem by comparing the coordinates and just using
    the initial bearing if the distance is too short. (< 10 µm on Earth)
  */
  const e = Cesium.Math.EPSILON12
  if (Math.abs(carto1.latitude - carto2.latitude) < e && Math.abs(carto1.longitude - carto2.longitude) < e) {
    return greatCircleInitialBearing(carto1, carto2)
  } else {
    return Cesium.Math.zeroToTwoPi(greatCircleInitialBearing(carto2, carto1) + Math.PI)
  }
}

export { greatCircleEndBearing }

/**
 * Calculates the translation from one point to another using the Harvesine formulae. The translation is a tuple containing the ground distance
 * as first element and the initial bearing as second element. This function returns the same results than `greatCircleDistance()` and
 * `greatCircleInitialBearing()` but requires less computation than calling both functions in succession.
 *
 * This function shares the following quasi-equality with `greatCircleTranslate()`:
 *
 * // given a and b, two Cartographic
 *
 * greatCircleTranslate(a, greatCircleTranslation(a, b)) ~= b
 *
 * @param {Cesium.Cartographic} carto1 The first cartographic coordinate.
 * @param {Cesium.Cartographic} carto2 The second cartographic coordinate.
 * @param {number} radius The radius in meters (defaults to MEAN_EARTH_RADIUS)
 * @returns {Array} A tuple containing the distance in meters between the two points as first element and the initial bearing in radians from first point to
 *   second point as second element (0° = North, 90° = East, 270° = West)
 */
function greatCircleTranslation (carto1, carto2, radius = MEAN_EARTH_RADIUS) {
  assert(carto1, 'carto1 must be defined')
  assert(carto2, 'carto2 must be defined')
  assert(typeof radius === 'number', 'radius must be a number')
  const R = radius
  const φ1 = carto1.latitude
  const λ1 = carto1.longitude
  const φ2 = carto2.latitude
  const λ2 = carto2.longitude
  const Δφ = φ2 - φ1
  const Δλ = λ2 - λ1

  const cosφ1 = Math.cos(φ1)
  const cosφ2 = Math.cos(φ2)

  const a = Math.pow(Math.sin(Δφ / 2), 2) + cosφ1 * cosφ2 * Math.pow(Math.sin(Δλ / 2), 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c

  const x = cosφ1 * Math.sin(φ2) - Math.sin(φ1) * cosφ2 * Math.cos(Δλ)
  const y = Math.sin(Δλ) * cosφ2
  const θ = Math.atan2(y, x)

  return [d, Cesium.Math.zeroToTwoPi(θ)]
}

export { greatCircleTranslation }

/**
 * Travels a distance from a given point with a given translation using the Harvesine formulae. The translation is a tuple
 * containing the ground distance as first element and the initial bearing as second element, as returned by the `greatCircleTranslation()`
 * function.
 *
 * This function shares the following quasi-equality with `greatCircleTranslation()`:
 *
 * // given a and b, two Cartographic
 *
 * greatCircleTranslate(a, greatCircleTranslation(a, b)) ~= b
 *
 * @param {Cesium.Cartographic} carto The initial cartographic coordinate
 * @param {Array} translation The translation to apply. It is a tuple where the first element is the ground distance in meters and the second
 * element is the initial bearing in radians (0° = North, 90° = East, 270° = West)
 * @param {number} radius The radius in meters (defaults to MEAN_EARTH_RADIUS)
 * @returns {Cesium.Cartographic} The new position
 */
function greatCircleTranslate (carto, translation, radius = MEAN_EARTH_RADIUS) {
  assert(carto, 'carto must be defined')
  assert(translation, 'translation must be defined')
  assert(typeof radius === 'number', 'radius must be a number')
  // original javascript implementation from Chris Veness : https://github.com/chrisveness/geodesy

  // sinφ2 = sinφ1⋅cosδ + cosφ1⋅sinδ⋅cosθ
  // tanΔλ = sinθ⋅sinδ⋅cosφ1 / cosδ−sinφ1⋅sinφ2
  // see mathforum.org/library/drmath/view/52049.html for derivation

  const δ = translation[0] / radius // angular distance in radians
  const θ = translation[1]

  const φ1 = carto.latitude
  const λ1 = carto.longitude

  const cosφ1 = Math.cos(φ1)
  const sinφ1 = Math.sin(φ1)
  const cosδ = Math.cos(δ)
  const sinδ = Math.sin(δ)

  const sinφ2 = sinφ1 * cosδ + cosφ1 * sinδ * Math.cos(θ)
  const φ2 = Math.asin(sinφ2)
  const y = Math.sin(θ) * sinδ * cosφ1
  const x = cosδ - sinφ1 * sinφ2
  const λ2 = λ1 + Math.atan2(y, x)

  const lat = φ2
  const lon = λ2

  return new Cesium.Cartographic(lon, lat, 0)
}

export { greatCircleTranslate }
