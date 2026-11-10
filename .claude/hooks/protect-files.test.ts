import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const hook = fileURLToPath(new URL("./protect-files.ts", import.meta.url))

function run(tool_name: string, tool_input: Record<string, string>) {
  const input = JSON.stringify({ tool_name, tool_input })
  return spawnSync("node", [hook], { input, encoding: "utf8" })
}

const runPath = (tool_name: string, file_path: string) =>
  run(tool_name, { file_path })
const runCommand = (command: string) => run("Bash", { command })

describe("protect-files hook: file tools", () => {
  it.each([".env", ".env.local", "db/migrations/001_init.sql"])(
    "blocks %s",
    (p) => {
      const r = runPath("Edit", `/repo/${p}`)
      expect(r.status).toBe(2)
      expect(r.stderr).toContain("Blocked")
    },
  )

  it.each(["src/env.ts", ".envrc", ".env.example"])("allows %s", (p) => {
    expect(runPath("Edit", `/repo/${p}`).status).toBe(0)
  })
})

describe("protect-files hook: Bash", () => {
  it.each([
    "cat .env",
    "grep KEY .env",
    "head -n1 .env.local",
    "rm db/migrations/001_init.sql",
  ])("blocks `%s`", (c) => {
    const r = runCommand(c)
    expect(r.status).toBe(2)
    expect(r.stderr).toContain("Blocked")
  })

  it.each(["cat .env.example", "cat src/env.ts", "pnpm test"])(
    "allows `%s`",
    (c) => {
      expect(runCommand(c).status).toBe(0)
    },
  )
})

describe("protect-files hook: architecture rules", () => {
  it.each([
    "src/architecture.test.ts",
    "docs/adr/0001-module-layers.md",
    ".github/workflows/ci.yml",
    ".github/CODEOWNERS",
  ])("blocks changing %s", (p) => {
    for (const tool of ["Edit", "Write"]) {
      const r = runPath(tool, `/repo/${p}`)
      expect(r.status).toBe(2)
      expect(r.stderr).toContain("rule file")
    }
  })

  it("allows reading the ADR", () => {
    expect(runPath("Read", "/repo/docs/adr/0001-module-layers.md").status).toBe(
      0,
    )
  })
})
