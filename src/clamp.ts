function isValidNumber(n: unknown): n is number {
  return typeof n === "number" && !Number.isNaN(n)
}

export function clamp(value: number, min: number, max: number): number {
  if (!isValidNumber(value) || !isValidNumber(min) || !isValidNumber(max)) {
    throw new TypeError("clamp: value, min and max must be numbers (not NaN)")
  }
  const [lo, hi] = min > max ? [max, min] : [min, max]
  return Math.min(Math.max(value, lo), hi)
}
