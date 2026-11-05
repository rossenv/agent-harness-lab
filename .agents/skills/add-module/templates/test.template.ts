import { describe, expect, it } from "vitest"
import { functionName } from "./module-name.ts"

describe("functionName", () => {
  it("does the main thing", () => {
    expect(functionName(/* input */)).toBe(/* expected */)
  })

  it("handles the edge case", () => {
    expect(functionName(/* edge input */)).toBe(/* expected */)
  })
})
