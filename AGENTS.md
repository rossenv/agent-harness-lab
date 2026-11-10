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
- No default exports, except in tool config files (vitest.config.ts).
- Every module in src/ is re-exported from src/index.ts, in alphabetical order.

## Architecture
- Module layers are decided in `docs/adr/0001-module-layers.md`. Read it before adding a module.
- Don't edit `docs/adr/` or `src/architecture.test.ts`. If a request conflicts with an ADR, don't work around it: stop and ask.
- Don't edit `.github/` (CI and CODEOWNERS). CI is the check that runs no matter who wrote the code; weakening it is a human decision.