import { describe, expect, it } from "vitest"
import { normalizeWord } from "./normalize-word.ts"

describe("normalizeWord", () => {
  it("lowercases and strips trailing punctuation", () => {
    expect(normalizeWord("Hello,")).toBe("hello")
  })

  it("keeps inner apostrophes", () => {
    expect(normalizeWord("don't")).toBe("don't")
  })

  it("strips leading and trailing punctuation", () => {
    expect(normalizeWord("(Hi!)")).toBe("hi")
  })

  it("keeps inner hyphens", () => {
    expect(normalizeWord("co-op.")).toBe("co-op")
  })

  it("returns an empty string when there are no letters or digits", () => {
    expect(normalizeWord("—")).toBe("")
    expect(normalizeWord("...")).toBe("")
    expect(normalizeWord("")).toBe("")
  })

  it("is Unicode-aware for letters and digits", () => {
    expect(normalizeWord("«Été»")).toBe("été")
    expect(normalizeWord("¿Qué?")).toBe("qué")
    expect(normalizeWord("(42)")).toBe("42")
  })

  it("does not count a fraction or other non-decimal number as a digit", () => {
    expect(normalizeWord("½")).toBe("")
    expect(normalizeWord("(²)")).toBe("")
  })

  it("keeps the combining accent of a decomposed letter", () => {
    expect(normalizeWord("cafe\u0301!")).toBe("cafe\u0301")
    expect(normalizeWord("\u201Ccafe\u0301\u201D")).toBe("cafe\u0301")
  })

  it("throws TypeError when token is not a string", () => {
    expect(() => normalizeWord(42 as unknown as string)).toThrow(TypeError)
    expect(() => normalizeWord(undefined as unknown as string)).toThrow(TypeError)
  })
})
