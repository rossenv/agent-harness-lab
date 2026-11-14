export function partition<T>(items: readonly T[], predicate: (item: T) => boolean): [T[], T[]] {
  const matching: T[] = []
  const rest: T[] = []

  for (const item of items) {
    if (predicate(item)) {
      matching.push(item)
    } else {
      rest.push(item)
    }
  }

  return [matching, rest]
}
