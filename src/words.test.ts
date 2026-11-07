import { describe, expect, it } from "vitest"
import { words } from "./words.ts"

describe("words", () => {
  it("splits on single spaces", () => {
    expect(words("hello big world")).toEqual(["hello", "big", "world"])
  })

  it("ignores leading, trailing and repeated whitespace", () => {
    expect(words("  hello \t\n world  ")).toEqual(["hello", "world"])
  })

  it("returns an empty array for blank text", () => {
    expect(words("")).toEqual([])
    expect(words("   ")).toEqual([])
  })

  it("throws TypeError when text is not a string", () => {
    expect(() => words(42 as unknown as string)).toThrow(TypeError)
  })
})
