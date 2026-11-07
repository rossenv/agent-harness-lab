import { capitalize } from "../capitalize.ts"
import { words } from "../words.ts"

/** Capitalizes the first letter of each word and joins them with single spaces. */
export function titleCase(text: string): string {
  return words(text).map(capitalize).join(" ")
}
