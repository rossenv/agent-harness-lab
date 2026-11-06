import { describe, expect, it } from "vitest"
import { capitalize } from "./capitalize.ts"

describe("capitalize", () => {
  it("uppercases the first character", () => {
    expect(capitalize("hello world")).toBe("Hello world")
  })

  it("returns an empty string unchanged", () => {
    expect(capitalize("")).toBe("")
  })

  it("throws TypeError when text is not a string", () => {
    expect(() => capitalize(42 as unknown as string)).toThrow(TypeError)
  })
})
