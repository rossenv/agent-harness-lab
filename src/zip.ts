export function zip<A, B>(a: readonly A[], b: readonly B[]): [A, B][] {
  const length = Math.min(a.length, b.length)
  const pairs: [A, B][] = []
  for (let i = 0; i < length; i++) {
    pairs.push([a[i] as A, b[i] as B])
  }
  return pairs
}
