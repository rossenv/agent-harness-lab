export function topWords(
  words: readonly string[],
  limit: number,
): { word: string; count: number }[] {
  if (!Array.isArray(words)) {
    throw new TypeError("words must be an array")
  }
  if (typeof limit !== "number" || !Number.isInteger(limit) || limit < 0) {
    throw new RangeError("limit must be a non-negative integer")
  }

  const counts = new Map<string, number>()
  for (const word of words) {
    counts.set(word, (counts.get(word) ?? 0) + 1)
  }

  return [...counts]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || (a.word < b.word ? -1 : a.word > b.word ? 1 : 0))
    .slice(0, limit)
}
