export function capitalize(text: string): string {
  if (typeof text !== "string") {
    throw new TypeError(`text must be a string, got ${typeof text}`)
  }
  return text.charAt(0).toUpperCase() + text.slice(1)
}
