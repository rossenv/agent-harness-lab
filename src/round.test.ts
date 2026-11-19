import { describe, expect, it } from "vitest"
import { round } from "./round.ts"

describe("round", () => {
  it("rounds half away from zero without float artifacts", () => {
    expect(round(1.005, 2)).toBe(1.01)
    expect(round(-1.005, 2)).toBe(-1.01)
    expect(round(2.5, 0)).toBe(3)
    expect(round(-2.5, 0)).toBe(-3)
  })

  it("keeps values that are already rounded", () => {
    expect(round(4.25, 2)).toBe(4.25)
  })

  it("rounds down below the half", () => {
    expect(round(2 / 3, 2)).toBe(0.67)
    expect(round(1.234, 2)).toBe(1.23)
  })

  it("handles zero without returning negative zero", () => {
    expect(round(0, 2)).toBe(0)
    expect(Object.is(round(-0.001, 2), 0)).toBe(true)
  })

  it("handles exponent-notation values", () => {
    expect(round(1e-7, 2)).toBe(0)
    expect(round(1e21, 2)).toBe(1e21)
  })

  it("throws RangeError for non-finite values", () => {
    expect(() => round(Number.NaN, 2)).toThrow(RangeError)
    expect(() => round(Number.POSITIVE_INFINITY, 2)).toThrow(RangeError)
    expect(() => round(Number.NEGATIVE_INFINITY, 2)).toThrow(RangeError)
  })

  it("throws TypeError for non-number arguments", () => {
    expect(() => round("1.5" as unknown as number, 2)).toThrow(TypeError)
    expect(() => round(1.5, "2" as unknown as number)).toThrow(TypeError)
  })

  it("throws RangeError for invalid decimals", () => {
    expect(() => round(1.5, -1)).toThrow(RangeError)
    expect(() => round(1.5, 21)).toThrow(RangeError)
    expect(() => round(1.5, 1.5)).toThrow(RangeError)
    expect(() => round(1.5, Number.NaN)).toThrow(RangeError)
  })

  it("accepts the decimals bounds 0 and 20", () => {
    expect(round(1.4, 0)).toBe(1)
    expect(round(1.5, 20)).toBe(1.5)
  })
})
