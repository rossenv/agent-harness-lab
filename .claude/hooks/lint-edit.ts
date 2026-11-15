// PostToolUse hook (Claude Code and Codex): lint each file the agent just edited.
// The edit has already happened; this sends the problems back so the agent fixes them now.
import { spawnSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

type HookInput = {
  cwd: string
  tool_input: { file_path?: string; command?: string }
}

const input: HookInput = JSON.parse(readFileSync(0, "utf8"))
const root = process.env.CLAUDE_PROJECT_DIR ?? input.cwd

// Claude Code's Edit and Write send file_path.
// Codex's apply_patch sends the whole patch in command, one "*** Update File: <path>" line per file.
const edited = input.tool_input.file_path
  ? [input.tool_input.file_path]
  : [
      ...(input.tool_input.command ?? "").matchAll(
        /^\*\*\* (?:Add|Update) File: (.+)$/gm,
      ),
    ].map((m) => (m[1] as string).trim())

const files = edited
  .map((p) => resolve(root, p))
  .filter((p) => /\.(ts|mts|js|mjs)$/.test(p) && existsSync(p))
if (files.length === 0) process.exit(0)

// A disable comment turns off every rule, including any rule that would catch it,
// so it's caught here with a plain text search instead.
const DIRECTIVE = /(oxlint|eslint)-(disable|enable)/
const problems: string[] = files
  .filter((f) => DIRECTIVE.test(readFileSync(f, "utf8")))
  .map(
    (f) =>
      `${f}: remove the lint disable comment. If a rule is wrong here, stop and ask: exceptions go in .oxlintrc.json, which a human owns.`,
  )

const lint = spawnSync(
  "pnpm",
  ["-s", "exec", "oxlint", "--deny-warnings", ...files],
  {
    cwd: root,
    encoding: "utf8",
  },
)
if (lint.status !== 0) problems.push(`${lint.stdout}${lint.stderr}`.trim())

if (problems.length === 0) process.exit(0)
console.error(
  `Lint failed on the file you just edited. Fix it before moving on.\n\n${problems.join("\n")}`,
)
process.exit(2)
