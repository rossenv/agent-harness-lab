---
name: add-module
description: Use when adding a new module or function under src/ in this repo. Writes the test first, watches it fail, then writes the module, following the repo's conventions.
disable-model-invocation: false
---

# Add a module

You need two things from the user: a module name in kebab-case, and what it
should do. If either is missing, ask before writing anything. Also ask what
should happen with invalid input unless the user already said.

1. Write `src/<name>.test.ts` first, starting from `templates/test.template.ts`
   in this skill's folder. Cover the behaviour the user described, plus one
   edge case.
2. Run `pnpm exec vitest run src/<name>.test.ts`. It must fail, because the
   module doesn't exist yet. If it passes, the test proves nothing: fix the
   test before going on.
3. Write `src/<name>.ts`. Use named exports only, never a default export.
4. Run `pnpm typecheck` and `pnpm test`. Both must pass. Don't change
   test scripts or config to make them pass.
5. Report the files you created, and quote the one line from step 2 that
   shows the test failed.
