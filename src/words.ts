/** Splits `text` into words separated by whitespace. */
export function words(text: string): string[] {
  if (typeof text !== "string") {
    throw new TypeError(`text must be a string, got ${typeof text}`)
  }
  const trimmed = text.trim()
  return trimmed === "" ? [] : trimmed.split(/\s+/)
}
