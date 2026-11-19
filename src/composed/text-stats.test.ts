import { describe, expect, it } from "vitest"
import { textStats } from "./text-stats.ts"

describe("textStats: what a word is", () => {
  it("lowercases and strips leading and trailing punctuation", () => {
    expect(textStats("Hello, WORLD!").topWords).toEqual([
      { word: "hello", count: 1 },
      { word: "world", count: 1 },
    ])
  })

  it("keeps punctuation inside a word", () => {
    expect(textStats("don't").topWords).toEqual([{ word: "don't", count: 1 }])
  })

  it("does not count a token with no letters or digits", () => {
    const stats = textStats("one — two ... three")
    expect(stats.words).toBe(3)
    expect(stats.topWords.map((t) => t.word)).not.toContain("")
  })

  it("does not count a lone fraction as a word", () => {
    expect(textStats("½ cup").words).toBe(1)
  })

  it("keeps the accent of a decomposed letter when stripping punctuation", () => {
    expect(textStats("cafe\u0301,").topWords).toEqual([{ word: "cafe\u0301", count: 1 }])
  })
})

describe("textStats: words", () => {
  it("counts every word, repeats included", () => {
    expect(textStats("the cat and the hat").words).toBe(5)
  })
})

describe("textStats: uniqueWords", () => {
  it("counts different words, ignoring case and punctuation", () => {
    expect(textStats("The the THE, cat. Cat!").uniqueWords).toBe(2)
  })
})

describe("textStats: averageWordLength", () => {
  it("is the mean word length", () => {
    expect(textStats("a bb ccc dddd").averageWordLength).toBe(2.5)
  })

  it("is rounded to 2 decimals", () => {
    // lengths 1, 1, 2: mean 1.3333...
    expect(textStats("a b cc").averageWordLength).toBe(1.33)
  })

  it("measures words after punctuation is stripped", () => {
    expect(textStats("hello, world!").averageWordLength).toBe(5)
  })

  it("is 0 when there are no words", () => {
    expect(textStats("— ...").averageWordLength).toBe(0)
  })
})

describe("textStats: topWords", () => {
  it("lists the most frequent word first", () => {
    expect(textStats("b a a c a b").topWords).toEqual([
      { word: "a", count: 3 },
      { word: "b", count: 2 },
      { word: "c", count: 1 },
    ])
  })

  it("counts case-insensitively", () => {
    expect(textStats("Go go GO").topWords).toEqual([{ word: "go", count: 3 }])
  })

  it("keeps only the 5 most frequent words", () => {
    const stats = textStats("a a a a a a b b b b b c c c c d d d e e f g")
    expect(stats.topWords.map((t) => t.word)).toEqual(["a", "b", "c", "d", "e"])
    expect(stats.uniqueWords).toBe(7)
  })

  it("lists fewer than 5 when there are fewer different words", () => {
    expect(textStats("x y").topWords).toHaveLength(2)
  })

  it("breaks ties in plain string order, not locale order", () => {
    // Locale order puts "é" before "f"; plain string order puts "f" before "é".
    expect(textStats("é f").topWords.map((t) => t.word)).toEqual(["f", "é"])
    expect(textStats("b a").topWords.map((t) => t.word)).toEqual(["a", "b"])
  })
})

describe("textStats: empty text", () => {
  it.each(["", "   \n\t "])("gives zeros and no top words for %j", (text) => {
    expect(textStats(text)).toEqual({
      words: 0,
      uniqueWords: 0,
      averageWordLength: 0,
      topWords: [],
    })
  })
})

describe("textStats: result shape", () => {
  it("has exactly the four documented keys", () => {
    expect(Object.keys(textStats("a"))).toEqual([
      "words",
      "uniqueWords",
      "averageWordLength",
      "topWords",
    ])
  })
})
