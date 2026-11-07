export function reverse(text: string): string {
  if (typeof text !== "string") {
    throw new TypeError("text must be a string")
  }

  return [...text].reverse().join("")
}
