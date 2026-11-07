import { describe, expect, it } from "vitest"
import { unique } from "./unique.ts"

describe("unique", () => {
  it("removes duplicates while preserving first occurrence order", () => {
    expect(unique([3, 1, 3, 2, 1])).toEqual([3, 1, 2])
    expect(unique(["b", "a", "b"])).toEqual(["b", "a"])
  })

  it("returns a new array without mutating readonly input", () => {
    const input = Object.freeze([1, 2, 1])
    const result = unique(input)

    expect(result).toEqual([1, 2])
    expect(result).not.toBe(input)
    expect(input).toEqual([1, 2, 1])
  })

  it("returns a new empty array for empty input", () => {
    const input: readonly number[] = []
    const result = unique(input)

    expect(result).toEqual([])
    expect(result).not.toBe(input)
  })

  it("uses SameValueZero equality for NaN and signed zero", () => {
    const result = unique([Number.NaN, Number.NaN, -0, 0])

    expect(result).toHaveLength(2)
    expect(result[0]).toBeNaN()
    expect(Object.is(result[1], -0)).toBe(true)
  })

  it("compares objects by identity", () => {
    const first = { value: 1 }
    const second = { value: 1 }
    const result = unique([first, second, first])

    expect(result).toHaveLength(2)
    expect(result[0]).toBe(first)
    expect(result[1]).toBe(second)
  })

  it("keeps distinct primitive types", () => {
    expect(unique<unknown>([1, "1", true, null, undefined, 1, null]))
      .toEqual([1, "1", true, null, undefined])
  })

  it("throws TypeError for non-array input", () => {
    for (const input of [null, undefined, "abc", 1, {}, new Set([1])]) {
      expect(() => unique(input as unknown as readonly unknown[])).toThrow(TypeError)
    }
  })
})
