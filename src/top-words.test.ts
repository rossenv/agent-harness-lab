import { describe, expect, it } from "vitest"
import { topWords } from "./top-words.ts"

describe("topWords", () => {
  it("orders by count, most frequent first", () => {
    expect(topWords(["a", "b", "b", "c", "c", "c"], 3)).toEqual([
      { word: "c", count: 3 },
      { word: "b", count: 2 },
      { word: "a", count: 1 },
    ])
  })

  it("returns only the limit most frequent", () => {
    expect(topWords(["a", "b", "b", "c", "c", "c"], 2)).toEqual([
      { word: "c", count: 3 },
      { word: "b", count: 2 },
    ])
  })

  it("breaks ties by plain string order", () => {
    expect(topWords(["pear", "apple", "fig"], 3)).toEqual([
      { word: "apple", count: 1 },
      { word: "fig", count: 1 },
      { word: "pear", count: 1 },
    ])
  })

  it("sorts uppercase before lowercase on ties (not localeCompare)", () => {
    expect(topWords(["a", "B"], 2)).toEqual([
      { word: "B", count: 1 },
      { word: "a", count: 1 },
    ])
  })

  it("does not fold case when counting", () => {
    expect(topWords(["a", "A", "a"], 2)).toEqual([
      { word: "a", count: 2 },
      { word: "A", count: 1 },
    ])
  })

  it("returns fewer than limit when there are fewer distinct words", () => {
    expect(topWords(["x", "x", "y"], 10)).toEqual([
      { word: "x", count: 2 },
      { word: "y", count: 1 },
    ])
  })

  it("returns [] for empty input", () => {
    expect(topWords([], 5)).toEqual([])
  })

  it("returns [] for limit 0", () => {
    expect(topWords(["a"], 0)).toEqual([])
  })

  it("throws TypeError when words is not an array", () => {
    expect(() => topWords("abc" as unknown as string[], 1)).toThrow(TypeError)
    expect(() => topWords(undefined as unknown as string[], 1)).toThrow(TypeError)
  })

  it("throws RangeError when limit is not a non-negative integer", () => {
    expect(() => topWords(["a"], -1)).toThrow(RangeError)
    expect(() => topWords(["a"], 1.5)).toThrow(RangeError)
    expect(() => topWords(["a"], Number.NaN)).toThrow(RangeError)
    expect(() => topWords(["a"], Infinity)).toThrow(RangeError)
    expect(() => topWords(["a"], "2" as unknown as number)).toThrow(RangeError)
  })
})
