import { describe, expect, it } from "vitest"
import { truncate } from "./truncate.ts"

describe("truncate", () => {
  it("returns text unchanged when it fits", () => {
    expect(truncate("hello", 5)).toBe("hello")
    expect(truncate("hi", 10)).toBe("hi")
  })

  it("cuts to max characters, ending with an ellipsis", () => {
    const result = truncate("hello world", 8)
    expect(result).toBe("hello w…")
    expect(result).toHaveLength(8)
  })

  it("handles max of 1", () => {
    expect(truncate("hello", 1)).toBe("…")
  })

  it("throws RangeError for max < 1", () => {
    expect(() => truncate("hello", 0)).toThrow(RangeError)
    expect(() => truncate("hello", -3)).toThrow(RangeError)
  })
})
