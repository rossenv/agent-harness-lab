import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const hook = fileURLToPath(new URL("./protect-files.ts", import.meta.url))

function run(tool_name: string, file_path: string) {
  const input = JSON.stringify({ tool_name, tool_input: { file_path } })
  return spawnSync("node", [hook], { input, encoding: "utf8" })
}

describe("protect-files hook", () => {
  it.each([".env", ".env.local", "db/migrations/001_init.sql"])(
    "blocks %s",
    (p) => {
      const r = run("Edit", `/repo/${p}`)
      expect(r.status).toBe(2)
      expect(r.stderr).toContain("Blocked")
    },
  )

  it.each(["src/env.ts", ".envrc", ".env.example"])("allows %s", (p) => {
    expect(run("Edit", `/repo/${p}`).status).toBe(0)
  })
})
