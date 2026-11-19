import { average } from "../average.ts"
import { normalizeWord } from "../normalize-word.ts"
import { round } from "../round.ts"
import { topWords } from "../top-words.ts"
import { unique } from "../unique.ts"
import { words } from "../words.ts"

export type TextStats = {
  words: number
  uniqueWords: number
  averageWordLength: number
  topWords: { word: string; count: number }[]
}

const TOP_WORDS = 5

/** Word statistics for `text`. A word is a whitespace token, lowercased, minus edge punctuation. */
export function textStats(text: string): TextStats {
  const found = words(text).map(normalizeWord).filter((word) => word !== "")
  return {
    words: found.length,
    uniqueWords: unique(found).length,
    averageWordLength:
      found.length === 0 ? 0 : round(average(found.map((word) => word.length)), 2),
    topWords: topWords(found, TOP_WORDS),
  }
}
