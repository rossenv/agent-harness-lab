/** Returns a lowercase ASCII slug, throwing if the title cannot produce one. */
export function slugify(title: string): string {
  if (typeof title !== "string") {
    throw new TypeError("slugify: title must be a string")
  }

  const slug = title
    .normalize("NFKD")
    .toLowerCase()
    .replace(/\p{M}+/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  if (slug.length === 0) {
    throw new Error("slugify: title must contain letters or numbers that produce an ASCII slug")
  }

  return slug
}
