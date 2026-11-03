// PreToolUse hook: block agent access to secrets and applied migrations.
import { readFileSync } from "node:fs"

type HookInput = {
  tool_name: string
  tool_input: { file_path?: string; command?: string }
}

// Checked against tool_input.file_path (Read, Edit, Write).
const PROTECTED_PATHS: RegExp[] = [
  /(^|\/)\.env(?!\.example$)(\.|$)/,
  /(^|\/)migrations\//,
]

// Checked against tool_input.command (Bash). Best-effort: see the lesson.
const PROTECTED_IN_COMMANDS: RegExp[] = [
  /(^|[^\w.-])\.env(?!\.example\b)(\.[\w-]+)*(?![\w.-])/,
  /(^|[\s\/'"])migrations\//,
]

const input: HookInput = JSON.parse(readFileSync(0, "utf8"))
const [target, rules] =
  input.tool_name === "Bash"
    ? [input.tool_input.command ?? "", PROTECTED_IN_COMMANDS]
    : [input.tool_input.file_path ?? "", PROTECTED_PATHS]

const hit = rules.find((re) => re.test(target))
if (hit) {
  console.error(
    `Blocked: ${target} touches a protected file (${hit}). Ask the human instead.`,
  )
  process.exit(2)
}
process.exit(0)
