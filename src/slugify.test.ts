import { describe, expect, it } from "vitest"
import { slugify } from "./slugify.ts"

describe("slugify", () => {
  it("turns a title into a lowercase URL slug", () => {
    expect(slugify("Hello, World!")).toBe("hello-world")
  })

  it("normalizes accents and repeated separators", () => {
    expect(slugify("  Café -- déjà_vu  ")).toBe("cafe-deja-vu")
  })

  it("preserves numbers and existing slugs", () => {
    expect(slugify("release-2026")).toBe("release-2026")
  })

  it.each(["", "   ", "!!!"])("throws when %j produces an empty slug", (title) => {
    expect(() => slugify(title)).toThrow(Error)
  })

  it.each([null, undefined, 42, {}, []])("throws for non-string input %j", (title) => {
    expect(() => slugify(title as unknown as string)).toThrow(TypeError)
  })
})
