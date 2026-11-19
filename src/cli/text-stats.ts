import { readFileSync } from "node:fs"
import { z } from "zod"
import { textStats } from "../composed/text-stats.ts"

export type RunResult = { stdout: string; stderr: string; code: number }

// The only valid command line: exactly one non-empty file path.
const argsSchema = z.tuple([z.string().min(1)])

// The file is external input too: only text goes on to `textStats`.
const textSchema = z.string()

const fail = (message: string): RunResult => ({
  stdout: "",
  stderr: `${message.replace(/\s*[\r\n]+\s*/g, " ").trim()}\n`,
  code: 1,
})

/** Runs the command. Pure apart from `readFile`, so the logic is testable without a process. */
export function run(argv: readonly string[], readFile: (path: string) => string): RunResult {
  const args = argsSchema.safeParse(argv)
  if (!args.success) return fail("usage: node src/cli/text-stats.ts <file>")
  const [path] = args.data

  let content: unknown
  try {
    content = readFile(path)
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    return fail(`text-stats: cannot read ${path}: ${reason}`)
  }

  const text = textSchema.safeParse(content)
  if (!text.success) return fail(`text-stats: cannot read ${path}: not text`)

  return { stdout: `${JSON.stringify(textStats(text.data))}\n`, stderr: "", code: 0 }
}

if (import.meta.main) {
  const result = run(process.argv.slice(2), (path) => readFileSync(path, "utf8"))
  if (result.stdout) process.stdout.write(result.stdout)
  if (result.stderr) console.error(result.stderr.trimEnd())
  process.exitCode = result.code
}
