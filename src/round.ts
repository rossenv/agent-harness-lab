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
  const text = String(abs)
  let rounded: number
  if (text.includes("e")) {
    // Exponent notation: tiny values round via toFixed; huge ones are integers already.
    rounded = abs < 1 ? Number(abs.toFixed(decimals)) : abs
  } else {
    // Shift the decimal point in the string domain to dodge binary float error.
    rounded = Number(`${Math.round(Number(`${text}e${decimals}`))}e-${decimals}`)
  }
  return rounded === 0 ? 0 : value < 0 ? -rounded : rounded
}
