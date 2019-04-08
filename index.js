const Color = require('color')

const colorStep = (base, range, step = [], iteration = 0, previous = 0) => {
  const { min, max } =
    typeof range === 'number' ? { min: range, max: range } : range
  const c = Color(colorTransform(base, step[iteration % step.length]))
  const result = c.hex()
  const luma = c.luminosity()

  if (iteration > 5000) return result
  const condition =
    min === max
      ? // simple fallback, should use range anyway
        luma <= max && previous >= min
      : luma <= max && luma >= min
  if (condition) return result
  else return colorStep(result, range, step, iteration + 1, luma)
}

const shades = (
  base,
  config = { 300: { min: 0.51, max: 0.58 } },
  { lighten = [{ lighten: 0.01 }], darken = [{ darken: 0.01 }] } = {}
) => {
  return Object.keys(config)
    .map(shade => {
      const range = config[shade]
      const { min, max } =
        typeof range === 'number' ? { min: range, max: range } : range
      let color = ''
      const luma = Color(base).luminosity()
      if (luma <= max && luma >= min) color = base
      else if (luma < max) color = colorStep(base, range, lighten)
      else if (luma > min) color = colorStep(base, range, darken)
      return { [shade]: color }
    })
    .reduce((a, c) => ({ ...a, ...c }), {})
}

const shadesConfig = {
  100: { min: 0.91, max: 0.95 },
  200: { min: 0.68, max: 0.75 },
  300: { min: 0.51, max: 0.58 },
  400: { min: 0.35, max: 0.4 },
  500: { min: 0.23, max: 0.29 },
  600: { min: 0.16, max: 0.19 },
  700: { min: 0.11, max: 0.14 },
  800: { min: 0.06, max: 0.09 },
  900: { min: 0.0, max: 0.08 },
}

const darken = [{ darken: 0.02 }, { saturate: 0.005 }, { blacken: 0.01 }]
const lighten = [{ lighten: 0.02 }, { whiten: 0.01 }]

const shadesPreset = color =>
  shades(color, shadesConfig, {
    lighten: [{ lighten: 0.02 }, { whiten: 0.01 }],
    darken: [{ darken: 0.02 }, { saturate: 0.005 }, { blacken: 0.01 }],
  })

function colorTransform(source, params = {}) {
  const {
    lighten = 0,
    darken = 0,
    saturate = 0,
    desaturate = 0,
    whiten = 0,
    blacken = 0,
    fade = 0,
    opaquer = 0,
    rotate = 0,
    mix = '#000000',
    mixAmount = 0,
    grayscale = false,
    negate = false,
  } = params

  const newColor = Color(source)
    .lighten(lighten)
    .darken(darken)
    .saturate(saturate)
    .desaturate(desaturate)
    .whiten(whiten)
    .blacken(blacken)
    .fade(fade)
    .opaquer(opaquer)
    .rotate(rotate)
    .mix(Color(mix), mixAmount)

  const color =
    grayscale && negate
      ? newColor.negate().grayscale()
      : negate
      ? newColor.negate()
      : grayscale
      ? newColor.grayscale()
      : newColor
  return color.hex()
}

module.exports = {
  shadesPreset, shadesConfig, shades,
}