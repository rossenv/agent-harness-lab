# agent-harness-lab

## Commands
- Test: `pnpm test` · Typecheck: `pnpm typecheck`
- Before saying a task is done, both must pass.

## Conventions
- Validate external input with Zod.
- "External input" means data that crosses a boundary (HTTP, files, env, CLI args).
  Plain function arguments aren't external input.
- Ask before adding a dependency.
- No default exports.