import "./slug-title.ts"
import { chunk } from "../chunk.ts"
import { sum } from "../sum.ts"

export function chunkSum(items: readonly number[], size: number): number[] {
  return chunk(items, size).map((items) => items.reduce(sum, 0))
}
