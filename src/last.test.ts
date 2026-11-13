import { describe, expect, it } from "vitest"
import { last } from "./last.ts"

describe("last", () => {
  it("returns the final element", () => {
    expect(last([1, 2, 3])).toBe(3)
    expect(last(["first", "last"])).toBe("last")
  })

  it("returns undefined for an empty array", () => {
    expect(last([])).toBeUndefined()
  })

  it("returns the only element of a singleton array", () => {
    expect(last([0])).toBe(0)
  })

  it("preserves the final element even when it is null or undefined", () => {
    expect(last([1, null])).toBeNull()
    expect(last([1, undefined])).toBeUndefined()
  })

  it("preserves object identity without mutating readonly input", () => {
    const final = { value: 2 }
    const items = Object.freeze([{ value: 1 }, final])

    expect(last(items)).toBe(final)
    expect(items).toEqual([{ value: 1 }, { value: 2 }])
  })
})
