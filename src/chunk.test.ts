import { describe, expect, it } from "vitest"
import { chunk } from "./chunk.ts"

describe("chunk", () => {
  it("splits items in order with a smaller final chunk", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  it("splits evenly without an empty trailing chunk", () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]])
  })

  it("returns an empty array for empty input", () => {
    expect(chunk([], 2)).toEqual([])
  })

  it("handles size one and sizes larger than the input", () => {
    expect(chunk(["a", "b"], 1)).toEqual([["a"], ["b"]])
    expect(chunk(["a", "b"], 3)).toEqual([["a", "b"]])
  })

  it("leaves the input unchanged and creates new chunk arrays", () => {
    const items = Object.freeze([1, 2, 3])
    const result = chunk(items, 5)
    expect(result).toEqual([[1, 2, 3]])
    expect(result[0]).not.toBe(items)
    expect(items).toEqual([1, 2, 3])
  })

  it.each([0, -1, 0.5, 1.5, Number.NaN, Infinity, -Infinity])(
    "throws RangeError for invalid size %s, even with empty input",
    (size) => {
      expect(() => chunk([1, 2], size)).toThrow(RangeError)
      expect(() => chunk([], size)).toThrow(RangeError)
    },
  )
})
