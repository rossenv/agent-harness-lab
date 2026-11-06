import { describe, expect, it } from "vitest"
import { countWords } from "./count-words.ts"

describe("countWords", () => {
  it("counts whitespace-separated words", () => {
    expect(countWords("hello world foo")).toBe(3)
  })

  it("handles repeated and mixed whitespace", () => {
    expect(countWords("  a \t b\n\nc  ")).toBe(3)
  })

  it("returns 0 for empty or whitespace-only strings", () => {
    expect(countWords("")).toBe(0)
    expect(countWords(" \t\n ")).toBe(0)
  })

  it("throws TypeError for non-string input", () => {
    expect(() => countWords(42 as unknown as string)).toThrow(TypeError)
    expect(() => countWords(null as unknown as string)).toThrow(TypeError)
  })
})
