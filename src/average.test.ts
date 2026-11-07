import { describe, expect, it } from "vitest"
import { average } from "./average.ts"

describe("average", () => {
  it("returns the arithmetic mean without changing the input", () => {
    const numbers = Object.freeze([2, 4, 9])
    expect(average(numbers)).toBe(5)
    expect(numbers).toEqual([2, 4, 9])
    expect(average([-6, 0, 3])).toBe(-1)
    expect(average([7])).toBe(7)
    expect(average([0, 0])).toBe(0)
    expect(average([0.1, 0.2])).toBeCloseTo(0.15)
  })

  it("handles large finite values without overflowing", () => {
    expect(average([Number.MAX_VALUE, Number.MAX_VALUE])).toBe(Number.MAX_VALUE)
    expect(average([-Number.MAX_VALUE, -Number.MAX_VALUE])).toBe(-Number.MAX_VALUE)
    expect(average([Number.MAX_VALUE, -Number.MAX_VALUE])).toBe(0)
    expect(average([Number.MIN_VALUE, Number.MIN_VALUE])).toBe(Number.MIN_VALUE)
    expect(average([Number.MAX_VALUE, 1, -Number.MAX_VALUE])).toBeCloseTo(1 / 3)
  })

  it("rejects an empty array", () => {
    expect(() => average([])).toThrow(RangeError)
  })

  it.each([NaN, Infinity, -Infinity])("rejects non-finite value %s", (value) => {
    expect(() => average([1, value])).toThrow(RangeError)
  })

  it.each([null, undefined, "12", 12, {}, { length: 1, 0: 2 }])(
    "rejects non-array input %s",
    (value) => {
      expect(() => average(value as unknown as readonly number[])).toThrow(TypeError)
    },
  )

  it.each(["2", null, undefined, true, {}, 2n])("rejects non-number element %s", (value) => {
    expect(() => average([1, value] as unknown as readonly number[])).toThrow(TypeError)
  })

  it("rejects sparse arrays", () => {
    expect(() => average(new Array<number>(2))).toThrow(TypeError)
    expect(() => average([1, , 3] as number[])).toThrow(TypeError)
  })
})
