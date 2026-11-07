import { describe, expect, it } from "vitest"
import { titleCase } from "./title-case.ts"

describe("titleCase", () => {
  it("capitalizes each word", () => {
    expect(titleCase("hello big world")).toBe("Hello Big World")
  })

  it("normalizes whitespace to single spaces", () => {
    expect(titleCase("  hello \n world ")).toBe("Hello World")
  })

  it("returns an empty string for blank text", () => {
    expect(titleCase("   ")).toBe("")
  })

  it("lets words errors through", () => {
    expect(() => titleCase(1 as unknown as string)).toThrow(TypeError)
  })
})
