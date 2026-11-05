# agent-harness-lab

## Commands
- Test: `pnpm test` · Typecheck: `pnpm typecheck`
- Before saying a task is done, both must pass.
- If you changed tests, test scripts or test config, have the `test-reviewer` agent review the change before you finish. Give it the task's intent. Report its verdict.

## Conventions
- Validate external input with Zod.
- "External input" means data that crosses a boundary (HTTP, files, env, CLI args).
  Plain function arguments aren't external input.
- Ask before adding a dependency.
- No default exports.