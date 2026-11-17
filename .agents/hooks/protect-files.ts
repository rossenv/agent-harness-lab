// PreToolUse hook (Claude Code and Codex): block agent access to secrets and applied
// migrations, and block agent edits to rule files.
import { readFileSync } from "node:fs"

type HookInput = {
  tool_name: string
  tool_input: { file_path?: string; command?: string }
}

// Checked against file paths (Read, Edit, Write, apply_patch).
const PROTECTED_PATHS: RegExp[] = [
  /(^|\/)\.env(?!\.example$)(\.|$)/,
  /(^|\/)migrations\//,
]

// Checked against tool_input.command (Bash). Best-effort: see the lesson.
const PROTECTED_IN_COMMANDS: RegExp[] = [
  /(^|[^\w.-])\.env(?!\.example\b)(\.[\w-]+)*(?![\w.-])/,
  /(^|[\s/'"])migrations\//,
]

// Agents may read these but not change them. Checked for Edit, Write and apply_patch.
const READ_ONLY_PATHS: RegExp[] = [
  // Architecture, CI, MCP and lint config
  /(^|\/)docs\/adr\//,
  /(^|\/)src\/architecture\.test\.ts$/,
  /(^|\/)\.github\//,
  /(^|\/)\.mcp\.json$/,
  /(^|\/)mcp\//,
  /(^|\/)\.oxlintrc\.json$/,
  // The harness itself: instructions, hooks, agent and tool config.
  // .claude/worktrees/ is excluded: Claude's worktree agents write code there.
  /(^|\/)AGENTS\.md$/,
  /(^|\/)CLAUDE\.md$/,
  /(^|\/)\.claude\/(?!worktrees\/)/,
  /(^|\/)\.codex\//,
  /(^|\/)\.agents\//,
  // What CI runs: the scripts, and the config they read.
  /(^|\/)package\.json$/,
  /(^|\/)vitest\.config\.ts$/,
  /(^|\/)tsconfig\.json$/,
]

const input: HookInput = JSON.parse(readFileSync(0, "utf8"))
const { tool_name, tool_input } = input

// Codex's apply_patch sends the whole patch in command, with one header line per file.
const patchPaths = (patch: string) =>
  [
    ...patch.matchAll(/^\*\*\* (?:(?:Add|Update|Delete) File|Move to): (.+)$/gm),
  ].map((m) => (m[1] as string).trim())

const isBash = tool_name === "Bash"
const isWrite = ["Edit", "Write", "apply_patch"].includes(tool_name)
const targets = isBash
  ? [tool_input.command ?? ""]
  : tool_name === "apply_patch"
    ? patchPaths(tool_input.command ?? "")
    : [tool_input.file_path ?? ""]

for (const target of targets) {
  if (isWrite && READ_ONLY_PATHS.some((re) => re.test(target))) {
    console.error(
      `Blocked: ${target} is a rule file (instructions, hooks, CI, checks or their config). Agents read it; humans change it. Ask the human instead.`,
    )
    process.exit(2)
  }
  const hit = (isBash ? PROTECTED_IN_COMMANDS : PROTECTED_PATHS).find((re) =>
    re.test(target),
  )
  if (hit) {
    console.error(
      `Blocked: ${target} touches a protected file (${hit}). Ask the human instead.`,
    )
    process.exit(2)
  }
}
process.exit(0)