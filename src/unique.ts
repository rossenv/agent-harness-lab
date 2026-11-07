export function unique<T>(items: readonly T[]): T[] {
  if (!Array.isArray(items)) {
    throw new TypeError("items must be an array")
  }

  const seen = new Set<T>()
  const result: T[] = []

  for (const item of items) {
    if (!seen.has(item)) {
      seen.add(item)
      result.push(item)
    }
  }

  return result
}
