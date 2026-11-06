# 0001: Two module layers in src/

Status: accepted (2026-11-06)

## Context
Agents add modules quickly. Without a rule, modules start importing each other,
and soon nothing can be changed or tested on its own.

## Decision
- **Core** modules live directly in `src/` (for example `src/slugify.ts`).
  They import nothing: no other module, no package.
- **Composed** modules live in `src/composed/`. They may import core modules
  (`../slugify.ts`) and nothing else: no other composed module, no package.
- `src/index.ts` re-exports every core and composed module, in alphabetical order.
- Test files are exempt.

## Consequences
- Every core module can be read, tested and replaced on its own.
- A new feature that combines modules goes in `src/composed/`.
- `src/architecture.test.ts` checks these rules, so `pnpm test` (and the Stop gate) fails when they break.