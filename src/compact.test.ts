import { describe, expect, it } from "vitest"
import { compact } from "./compact.ts"

describe("compact", () => {
  it("removes null and undefined", () => {
    expect(compact([1, null, 2, undefined, 3])).toEqual([1, 2, 3])
  })

  it("keeps other falsy values and handles an empty array", () => {
    expect(compact([0, "", false, Number.NaN, null])).toEqual([0, "", false, Number.NaN])
    expect(compact([])).toEqual([])
  })
})
