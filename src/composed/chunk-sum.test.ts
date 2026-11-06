import { describe, expect, it } from "vitest"
import { chunkSum } from "./chunk-sum.ts"

describe("chunkSum", () => {
  it("sums chunks in order including a smaller final chunk", () => {
    expect(chunkSum([1, 2, 3, 4, 5], 2)).toEqual([3, 7, 5])
  })

  it("sums evenly sized chunks with negative numbers and zero", () => {
    expect(chunkSum([-2, 2, 0, 4], 2)).toEqual([0, 4])
  })

  it("returns an empty array for empty input", () => {
    expect(chunkSum([], 2)).toEqual([])
  })

  it("handles size one and sizes larger than the input", () => {
    expect(chunkSum([1, 2], 1)).toEqual([1, 2])
    expect(chunkSum([1, 2], 3)).toEqual([3])
  })

  it("accepts readonly input without changing it", () => {
    const items = Object.freeze([1, 2, 3])
    expect(chunkSum(items, 2)).toEqual([3, 3])
    expect(items).toEqual([1, 2, 3])
  })

  it.each([0, -1, 0.5, Number.NaN, Infinity, -Infinity])(
    "lets chunk's RangeError through for invalid size %s",
    (size) => {
      const error = new RangeError("chunk: size must be a positive integer")
      expect(() => chunkSum([1, 2], size)).toThrow(error)
      expect(() => chunkSum([], size)).toThrow(error)
    },
  )
})
