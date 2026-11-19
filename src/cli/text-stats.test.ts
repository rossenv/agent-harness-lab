import { spawnSync } from "node:child_process"
import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { run } from "./text-stats.ts"

const files: Record<string, string> = {
  "/f.txt": "The cat and the hat. The end",
  "/empty.txt": "",
}
const readFile = (path: string): string => {
  const text = files[path]
  if (text === undefined) throw new Error(`ENOENT: no such file, open '${path}'`)
  return text
}

describe("run: success", () => {
  it("prints one line of JSON with the four keys and exits 0", () => {
    const result = run(["/f.txt"], readFile)
    expect(result.code).toBe(0)
    expect(result.stderr).toBe("")
    expect(result.stdout.endsWith("\n")).toBe(true)
    expect(result.stdout.trimEnd()).not.toContain("\n")
    expect(JSON.parse(result.stdout)).toEqual({
      words: 7,
      uniqueWords: 5,
      averageWordLength: 3,
      topWords: [
        { word: "the", count: 3 },
        { word: "and", count: 1 },
        { word: "cat", count: 1 },
        { word: "end", count: 1 },
        { word: "hat", count: 1 },
      ],
    })
  })

  it("prints compact JSON in the documented key order", () => {
    const line = run(["/f.txt"], readFile).stdout.trimEnd()
    expect(line.startsWith('{"words":7,"uniqueWords":5,"averageWordLength":3,"topWords":[{"word":"the","count":3}')).toBe(true)
  })

  it("prints zeros and an empty topWords for an empty file, and exits 0", () => {
    const result = run(["/empty.txt"], readFile)
    expect(result).toEqual({
      stdout: '{"words":0,"uniqueWords":0,"averageWordLength":0,"topWords":[]}\n',
      stderr: "",
      code: 0,
    })
  })
})

describe("run: failures print one line on stderr, nothing on stdout, exit 1", () => {
  // Summarises a failed run: exit code, stdout, and how many lines went to stderr.
  const failure = (result: ReturnType<typeof run>) => ({
    code: result.code,
    stdout: result.stdout,
    stderrEndsWithNewline: result.stderr.endsWith("\n"),
    stderrLines: result.stderr.trimEnd() === "" ? 0 : result.stderr.trimEnd().split("\n").length,
  })
  const oneLineFailure = {
    code: 1,
    stdout: "",
    stderrEndsWithNewline: true,
    stderrLines: 1,
  }

  it("with no argument", () => {
    expect(failure(run([], readFile))).toEqual(oneLineFailure)
  })

  it("with more than one argument", () => {
    expect(failure(run(["/f.txt", "/empty.txt"], readFile))).toEqual(oneLineFailure)
  })

  it("with an empty-string argument", () => {
    expect(failure(run([""], readFile))).toEqual(oneLineFailure)
  })

  it("with a file that can't be read", () => {
    const result = run(["/missing.txt"], readFile)
    expect(failure(result)).toEqual(oneLineFailure)
    expect(result.stderr).toContain("/missing.txt")
  })

  it("keeps a multi-line read error to one line", () => {
    const result = run(["/f.txt"], () => {
      throw new Error("first line\nsecond line")
    })
    expect(failure(result)).toEqual(oneLineFailure)
  })
})

describe("the command itself", () => {
  const script = join(import.meta.dirname, "text-stats.ts")
  const dir = mkdtempSync(join(tmpdir(), "text-stats-"))
  const exec = (...args: string[]) =>
    spawnSync(process.execPath, [script, ...args], { encoding: "utf8" })

  it("prints the stats of a real file", () => {
    const file = join(dir, "sample.txt")
    writeFileSync(file, "Hello, hello world\n")
    const result = exec(file)
    expect(result.status).toBe(0)
    expect(result.stderr).toBe("")
    expect(result.stdout).toBe(
      '{"words":3,"uniqueWords":2,"averageWordLength":5,"topWords":[{"word":"hello","count":2},{"word":"world","count":1}]}\n',
    )
  })

  it("exits 1 with one stderr line and no stdout when given no argument", () => {
    const result = exec()
    expect(result.status).toBe(1)
    expect(result.stdout).toBe("")
    expect(result.stderr.trimEnd().split("\n")).toHaveLength(1)
  })

  it("exits 1 with one stderr line and no stdout for a missing file", () => {
    const result = exec(join(dir, "nope.txt"))
    expect(result.status).toBe(1)
    expect(result.stdout).toBe("")
    expect(result.stderr.trimEnd().split("\n")).toHaveLength(1)
  })

  it("exits 1 when the path is a directory", () => {
    const result = exec(dir)
    expect(result.status).toBe(1)
    expect(result.stdout).toBe("")
  })
})
