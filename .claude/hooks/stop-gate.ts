// Stop hook: the agent can't finish while typecheck or tests fail.
// It gets one retry; after that it may stop, but the human is told.
import { spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"

type StopInput = { cwd: string; stop_hook_active?: boolean }

const input: StopInput = JSON.parse(readFileSync(0, "utf8"))
const root = process.env.CLAUDE_PROJECT_DIR ?? input.cwd
const run = (cmd: string, args: string[]) =>
  spawnSync(cmd, args, { cwd: root, encoding: "utf8" })

// Nothing changed since the last commit: nothing to verify.
if (run("git", ["status", "--porcelain"]).stdout.trim() === "") process.exit(0)

for (const script of ["typecheck", "test:changed"]) {
  const r = run("pnpm", ["-s", script])
  if (r.status === 0) continue

  if (input.stop_hook_active) {
    // Already had its retry: stop looping and escalate to the human.
    const systemMessage = `Quality gate: \`pnpm ${script}\` still fails. Review before merging.`
    console.log(JSON.stringify({ systemMessage }))
    process.exit(0)
  }
  const tail = `${r.stdout}${r.stderr}`.trim().split("\n").slice(-20).join("\n")
  console.error(
    `Not done: \`pnpm ${script}\` fails. Fix the cause, then finish.\n\n${tail}`,
  )
  process.exit(2)
}
process.exit(0)
