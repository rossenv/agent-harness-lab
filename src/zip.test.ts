import { describe, expect, it } from "vitest"
import { zip } from "./zip.ts"

describe("zip", () => {
  it("pairs elements and stops at the shorter array", () => {
    expect(zip([1, 2, 3], ["a", "b"])).toEqual([
      [1, "a"],
      [2, "b"],
    ])
    expect(zip([1], ["a", "b"])).toEqual([[1, "a"]])
  })

  it("returns an empty array when either input is empty", () => {
    expect(zip([], [1, 2])).toEqual([])
    expect(zip([1, 2], [])).toEqual([])
  })
})
