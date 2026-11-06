import { describe, expect, it } from "vitest"
import { slugTitle } from "./slug-title.ts"

describe("slugTitle", () => {
  it("returns the full slug when it fits within max", () => {
    expect(slugTitle("Hello World", 20)).toBe("hello-world")
  })

  it("cuts the slug to max characters", () => {
    expect(slugTitle("Hello World", 8)).toBe("hello-wo")
  })

  it("drops a trailing hyphen left by the cut", () => {
    expect(slugTitle("Hello World", 6)).toBe("hello")
  })

  it.each([0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "throws RangeError for max=%s",
    (max) => {
      expect(() => slugTitle("Hello", max)).toThrow(RangeError)
    },
  )

  it("lets slugify errors through", () => {
    expect(() => slugTitle("!!!", 10)).toThrow(/slugify/)
  })
})
