# 0002: An app layer for entry points

Status: accepted (2026-11-18)

## Context
ADR 0001 has two layers, and neither may import a package. A command-line
entry point has to read arguments and files, and AGENTS.md says to validate
that input with Zod. Asked to plan a CLI, both agents stopped at this conflict.
One suggested putting the entry point outside `src/`, where the architecture
test, the no-console rule and the disable-comment search don't look.

## Decision
- Entry points live in `src/cli/`. They may import `node:` built-ins, `zod`,
  and core and composed modules. Nothing else, and not each other.
- Nothing imports from `src/cli/`, and `src/index.ts` doesn't re-export it.
- All I/O (arguments, files, stdout, stderr, exit codes) happens in `src/cli/`.
  Core and composed modules stay pure.
- Any other folder in `src/`, or a subfolder of a layer, needs an ADR first.
- Test files are exempt, as in ADR 0001: a CLI test may import its entry point.

## Consequences
- The logic is tested without starting a process. A CLI test covers only the I/O.
- `console` is allowed in `src/cli/` and nowhere else in `src/` (`.oxlintrc.json`).
- `src/architecture.test.ts` checks the CLI imports, and fails on any folder in
  `src/` it has no rule for.