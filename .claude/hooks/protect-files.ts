// PreToolUse hook: block agent access to secrets and applied migrations.
import { readFileSync } from "node:fs"

type HookInput = {
  tool_name: string
  tool_input: { file_path?: string }
}

const PROTECTED: RegExp[] = [
  /(^|\/)\.env(?!\.example$)(\.|$)/,
  /(^|\/)migrations\//,
]

const input: HookInput = JSON.parse(readFileSync(0, "utf8"))
const path = input.tool_input.file_path ?? ""

const hit = PROTECTED.find((re) => re.test(path))
if (hit) {
  console.error(
    `Blocked: ${path} is protected (${hit}). Ask the human instead.`,
  )
  process.exit(2)
}
process.exit(0)
