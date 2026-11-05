import { expect, it } from "vitest"

import { sum } from "./sum.ts"

it("adds", () => expect(sum(2, 3)).toBe(5))
