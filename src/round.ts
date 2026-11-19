export function round(value: number, decimals: number): number {
  if (typeof value !== "number" || typeof decimals !== "number") {
    throw new TypeError("round: value and decimals must be numbers")
  }
  if (!Number.isFinite(value)) {
    throw new RangeError("round: value must be finite")
  }
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 20) {
    throw new RangeError("round: decimals must be an integer from 0 to 20")
  }
  const abs = Math.abs(value)
  const shifted = shift(abs, decimals)
  // Shifting a huge value can overflow; such a value has no decimals left to round.
  const rounded = Number.isFinite(shifted) ? shift(Math.round(shifted), -decimals) : abs
  return rounded === 0 ? 0 : value < 0 ? -rounded : rounded
}

// Moves the decimal point by `places` in the string domain, which avoids binary float error.
function shift(value: number, places: number): number {
  const [mantissa, exponent] = value.toExponential().split("e")
  return Number(`${mantissa}e${Number(exponent) + places}`)
}
