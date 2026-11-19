/** Lowercases `token` and strips leading and trailing characters that aren't letters, combining marks or decimal digits. */
export function normalizeWord(token: string): string {
  if (typeof token !== "string") {
    throw new TypeError(`token must be a string, got ${typeof token}`)
  }
  return token.toLowerCase().replace(/^[^\p{L}\p{Nd}]+|[^\p{L}\p{M}\p{Nd}]+$/gu, "")
}
