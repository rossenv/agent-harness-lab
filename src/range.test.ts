import { describe, expect, it } from "vitest"
import { range } from "./range.ts"

describe("range", () => {
  it("returns integers from start up to but not including end", () => {
    expect(range(2, 5)).toEqual([2, 3, 4])
    expect(range(-2, 1)).toEqual([-2, -1, 0])
  })

  it("returns an empty array when end <= start", () => {
    expect(range(5, 5)).toEqual([])
    expect(range(5, 2)).toEqual([])
  })

  it("throws TypeError for non-number arguments", () => {
    expect(() => range("1" as never, 3)).toThrow(TypeError)
    expect(() => range(1, undefined as never)).toThrow(TypeError)
  })

  it("throws RangeError for non-integers, NaN and Infinity", () => {
    expect(() => range(1.5, 3)).toThrow(RangeError)
    expect(() => range(1, 2.5)).toThrow(RangeError)
    expect(() => range(Number.NaN, 3)).toThrow(RangeError)
    expect(() => range(0, Number.POSITIVE_INFINITY)).toThrow(RangeError)
  })
})
