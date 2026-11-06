import { slugify } from "../slugify.ts"

/** Returns a URL slug of `text`, at most `max` characters long. */
export function slugTitle(text: string, max: number): string {
  if (!Number.isInteger(max) || max <= 0) {
    throw new RangeError("slugTitle: max must be a positive integer")
  }

  return slugify(text).slice(0, max).replace(/-+$/, "")
}
