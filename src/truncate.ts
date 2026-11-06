export function truncate(text: string, max: number): string {
  if (max < 1) {
    throw new RangeError(`max must be at least 1, got ${max}`)
  }
  if (text.length <= max) {
    return text
  }
  return text.slice(0, max - 1) + "…"
}
