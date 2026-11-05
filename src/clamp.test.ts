import { describe, expect, it } from "vitest"
import { clamp } from "./clamp.ts"

describe("clamp", () => {
  it("returns the value when within range", () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })

  it("clamps below min and above max", () => {
    expect(clamp(-3, 0, 10)).toBe(0)
    expect(clamp(42, 0, 10)).toBe(10)
  })

  it("handles the edge case where min equals max", () => {
    expect(clamp(7, 3, 3)).toBe(3)
  })

  it("throws RangeError when min is greater than max", () => {
    expect(() => clamp(5, 10, 0)).toThrow(RangeError)
  })

  it("throws TypeError for NaN or non-number arguments", () => {
    expect(() => clamp(Number.NaN, 0, 10)).toThrow(TypeError)
    expect(() => clamp(5, Number.NaN, 10)).toThrow(TypeError)
    expect(() => clamp(5, 0, "10" as unknown as number)).toThrow(TypeError)
  })
})
