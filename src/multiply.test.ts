import { expect, it } from "vitest"

import { multiply } from "./multiply.ts"

it("multiplies", () => expect(multiply(2, 3)).toBe(6))
