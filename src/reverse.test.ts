import { describe, expect, it } from "vitest"
import { reverse } from "./reverse.ts"

describe("reverse", () => {
  it("reverses text while preserving spaces and punctuation", () => {
    expect(reverse("Hello, world!")).toBe("!dlrow ,olleH")
  })

  it("preserves astral characters while reversing Unicode code points", () => {
    expect(reverse("A😀𝄞B")).toBe("B𝄞😀A")
  })

  it("reverses combining marks as individual code points", () => {
    expect(reverse("e\u0301x")).toBe("x\u0301e")
  })

  it("accepts empty text", () => {
    expect(reverse("")).toBe("")
  })

  it.each([null, undefined, 42, true, {}, [], new String("abc")])(
    "throws for non-string input %j",
    (text) => {
      expect(() => reverse(text as unknown as string)).toThrow(TypeError)
    },
  )
})
