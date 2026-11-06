export function countWords(text: string): number {
  if (typeof text !== "string") {
    throw new TypeError("countWords: text must be a string")
  }
  const trimmed = text.trim()
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length
}
