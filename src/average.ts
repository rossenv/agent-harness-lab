export function average(numbers: readonly number[]): number {
  if (!Array.isArray(numbers)) throw new TypeError("Expected an array of numbers")
  if (numbers.length === 0) throw new RangeError("Cannot average an empty array")

  let scale = 0
  for (let index = 0; index < numbers.length; index++) {
    if (!Object.hasOwn(numbers, index) || typeof numbers[index] !== "number") {
      throw new TypeError("Expected a number at every array index")
    }
    const value = numbers[index]!
    if (!Number.isFinite(value)) throw new RangeError("Expected finite numbers")
    scale = Math.max(scale, Math.abs(value))
  }
  if (scale === 0) return 0

  // Power-of-two scaling avoids overflow without rounding ordinary divisions.
  scale = 2 ** Math.min(1023, Math.floor(Math.log2(scale)))
  // Compensation preserves small terms when positive and negative values cancel.
  let sum = 0
  let correction = 0
  for (const number of numbers) {
    const value = number / scale
    const next = sum + value
    correction += Math.abs(sum) >= Math.abs(value)
      ? (sum - next) + value
      : (value - next) + sum
    sum = next
  }
  return ((sum + correction) / numbers.length) * scale
}
