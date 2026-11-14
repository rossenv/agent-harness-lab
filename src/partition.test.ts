import { describe, expect, it } from "vitest"
import { partition } from "./partition.ts"

describe("partition", () => {
  it("splits matching and remaining elements in original order", () => {
    expect(partition([1, 2, 3, 4], n => n % 2 === 0)).toEqual([[2, 4], [1, 3]])
    expect(partition([3, 2, 3, 1, 2], n => n > 2)).toEqual([[3, 3], [2, 1, 2]])
  })

  it("returns two empty arrays without calling the predicate for empty input", () => {
    expect(partition([], () => { throw new Error("unexpected call") })).toEqual([[], []])
  })

  it("handles all matching and no matching elements", () => {
    expect(partition([1, 2], () => true)).toEqual([[1, 2], []])
    expect(partition([1, 2], () => false)).toEqual([[], [1, 2]])
  })

  it("preserves object identity without mutating readonly input", () => {
    const first = { active: true }
    const second = { active: false }
    const items = Object.freeze([first, second])
    const [matching, rest] = partition(items, item => item.active)

    expect(matching[0]).toBe(first)
    expect(rest[0]).toBe(second)
    expect(items).toEqual([{ active: true }, { active: false }])
  })

  it("propagates predicate errors", () => {
    const error = new Error("predicate failed")
    expect(() => partition([1], () => { throw error })).toThrow(error)
  })
})
