import { describe, expect, it } from "vitest"
import { first } from "./first.ts"

describe("first", () => {
  it("returns the first element", () => {
    expect(first([1, 2, 3])).toBe(1)
    expect(first(["first", "last"])).toBe("first")
  })

  it("returns undefined for an empty array", () => {
    expect(first([])).toBeUndefined()
  })

  it("returns the only element of a singleton array", () => {
    expect(first([0])).toBe(0)
  })

  it("preserves null and undefined as the first element", () => {
    expect(first([null, 1])).toBeNull()
    expect(first([undefined, 1])).toBeUndefined()
  })

  it("preserves object identity without mutating readonly input", () => {
    const item = { value: 1 }
    const items = Object.freeze([item, { value: 2 }])

    expect(first(items)).toBe(item)
    expect(items).toEqual([{ value: 1 }, { value: 2 }])
  })
})
