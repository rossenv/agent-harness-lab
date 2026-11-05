import { expect, it } from "vitest"

import { sum } from "./sum.ts"

it("multiplies", () => expect(sum(2, 3)).toBe(5))
