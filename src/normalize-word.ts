/** Lowercases `token` and strips leading and trailing non-letter, non-digit characters. */
export function normalizeWord(token: string): string {
  if (typeof token !== "string") {
    throw new TypeError(`token must be a string, got ${typeof token}`)
  }
  return token.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")
}
