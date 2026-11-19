// Checks the module layers from docs/adr/0001-module-layers.md and 0002-app-layer.md
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const ADR = "docs/adr/0001-module-layers.md"
const APP_ADR = "docs/adr/0002-app-layer.md"
const LAYERS = ["cli", "composed"]

const isModule = (f: string) => f.endsWith(".ts") && !f.endsWith(".test.ts")
const core = readdirSync("src").filter((f) => isModule(f) && f !== "index.ts")
const composed = readdirSync("src/composed", { withFileTypes: true })
  .filter((e) => e.isFile() && isModule(e.name))
  .map((e) => `composed/${e.name}`)
const cli = existsSync("src/cli")
  ? readdirSync("src/cli").filter(isModule).map((f) => `cli/${f}`)
  : []

// Every module path in `import ... from "x"`, `export ... from "x"`, `import "x"` and `import("x")`.
function importsOf(path: string): string[] {
  const source = readFileSync(`src/${path}`, "utf8")
  const pattern = /(?:from|import)\s*\(?\s*["']([^"']+)["']/g
  return [...source.matchAll(pattern)].map((m) => m[1] as string)
}

describe(`architecture (${ADR})`, () => {
  it.each(core)("core module src/%s imports nothing", (file) => {
    const imports = importsOf(file)
    expect(
      imports,
      `src/${file} imports ${imports.join(", ")}. Core modules import nothing. ` +
        `If it combines modules, move it to src/composed/ and import from "../<name>.ts". See ${ADR}.`,
    ).toEqual([])
  })

  it.each(composed)(
    "composed module src/%s imports only core modules",
    (file) => {
      const allowed = core.map((f) => `../${f}`)
      const bad = importsOf(file).filter((i) => !allowed.includes(i))
      expect(
        bad,
        `src/${file} imports ${bad.join(", ")}. Composed modules may import only core modules ` +
          `(for example "../slugify.ts"): no packages, no other composed modules. See ${ADR}.`,
      ).toEqual([])
    },
  )

  it("src/ has no folders outside the known layers", () => {
    const folders = readdirSync("src", { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
    const unknown = folders.filter((f) => !LAYERS.includes(f))
    expect(
      unknown,
      `src/ has folders no layer rule covers: ${unknown.join(", ")}. ` +
        `A new layer needs an ADR and a rule here first. See ${APP_ADR}.`,
    ).toEqual([])
  })

  it("cli modules import only node: built-ins, zod, core and composed modules", () => {
    const allowed = [
      ...core.map((f) => `../${f}`),
      ...composed.map((f) => `../${f}`),
    ]
    for (const file of cli) {
      const bad = importsOf(file).filter(
        (i) => !i.startsWith("node:") && i !== "zod" && !allowed.includes(i),
      )
      expect(
        bad,
        `src/${file} imports ${bad.join(", ")}. CLI modules may import node: built-ins, ` +
          `zod, and core or composed modules. See ${APP_ADR}.`,
      ).toEqual([])
    }
  })

  it("src/index.ts re-exports every module in alphabetical order", () => {
    const expected = [...core, ...composed]
      .map((f) => `./${f}`)
      .sort((a, b) => a.split("/").at(-1)!.localeCompare(b.split("/").at(-1)!))
    expect(
      importsOf("index.ts"),
      `src/index.ts must re-export every module, sorted by file name. See ${ADR}.`,
    ).toEqual(expected)
  })
})
