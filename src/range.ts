export function range(start: number, end: number): number[] {
  if (typeof start !== "number" || typeof end !== "number") {
    throw new TypeError("range: start and end must be numbers")
  }
  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    throw new RangeError("range: start and end must be integers")
  }
  const result: number[] = []
  for (let i = start; i < end; i++) result.push(i)
  return result
}
