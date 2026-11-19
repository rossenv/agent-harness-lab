# Brief: text-stats

`node src/cli/text-stats.ts <file>` reads a UTF-8 text file and prints one line of JSON:

    {"words":12,"uniqueWords":9,"averageWordLength":4.25,"topWords":[{"word":"the","count":3}]}

## Decisions
- **A word** is a token from `words()`, lowercased, with leading and trailing
  punctuation removed: `"Hello,"` → `hello`, `"don't"` stays `don't`.
  A token with no letters or digits (`"—"`) isn't a word.
- `words`: how many words. 
- `uniqueWords`: how many different words.
- `averageWordLength`: the mean length of the words, rounded to 2 decimals. 0 when there are no words.
- `topWords`: the 5 most frequent words, most frequent first. Ties in plain string order (`<`), not locale order. Fewer than 5 if there are fewer words.
- An empty file prints zeros and `"topWords":[]`, and exits 0.
- Not exactly one argument, or a file that can't be read: one line on stderr, exit code 1, nothing on stdout.

## Done means
- Every decision above has a test.
- `pnpm typecheck`, `pnpm lint` and `pnpm test` pass, and the test-reviewer says PASS.