// MCP server: a stand-in for the team's issue tracker (Jira, Linear, GitHub Issues).
// The issues live outside the repo, in TRACKER_FILE (default ~/.lab-tracker/issues.json).
// stdout is the protocol channel: log with console.error, never console.log.
import { readFileSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { McpServer } from "@modelcontextprotocol/server"
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio"
import * as z from "zod/v4"

const Issue = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(["open", "done"]),
  author: z.string(),
  body: z.string(),
  comments: z.array(z.object({ author: z.string(), text: z.string() })),
})
type Issue = z.infer<typeof Issue>

const file =
  process.env.TRACKER_FILE || join(homedir(), ".lab-tracker", "issues.json")
const load = (): Issue[] =>
  z.array(Issue).parse(JSON.parse(readFileSync(file, "utf8")))
const save = (issues: Issue[]) =>
  writeFileSync(file, JSON.stringify(issues, null, 2) + "\n")

const reply = (text: string, isError = false) => ({
  content: [{ type: "text" as const, text }],
  isError,
})
const IssueId = z.string().regex(/^LAB-\d+$/, "an id like LAB-1")

const server = new McpServer({ name: "tracker", version: "1.0.0" })

server.registerTool(
  "list_issues",
  {
    description: "List issues in the team tracker: id, status and title.",
    inputSchema: z.object({ status: z.enum(["open", "done"]).optional() }),
    annotations: { readOnlyHint: true },
  },
  async ({ status }) => {
    const rows = load()
      .filter((i) => status === undefined || i.status === status)
      .map((i) => `${i.id} [${i.status}] ${i.title}`)
    return reply(rows.join("\n") || "No issues.")
  },
)

server.registerTool(
  "get_issue",
  {
    description: "Read one issue: title, author, description and comments.",
    inputSchema: z.object({ id: IssueId }),
    annotations: { readOnlyHint: true },
  },
  async ({ id }) => {
    const issue = load().find((i) => i.id === id)
    if (!issue) return reply(`No issue ${id}.`, true)
    const comments = issue.comments.map((c) => `- ${c.author}: ${c.text}`)
    return reply(
      [
        `${issue.id}: ${issue.title}`,
        `Status: ${issue.status} · Author: ${issue.author}`,
        "",
        issue.body,
        "",
        "Comments:",
        ...(comments.length ? comments : ["(none)"]),
      ].join("\n"),
    )
  },
)

server.registerTool(
  "add_comment",
  {
    description: "Add a comment to an issue. Visible to the whole team.",
    inputSchema: z.object({ id: IssueId, text: z.string().min(1).max(2000) }),
    annotations: { readOnlyHint: false, destructiveHint: false },
  },
  async ({ id, text }) => {
    const issues = load()
    const issue = issues.find((i) => i.id === id)
    if (!issue) return reply(`No issue ${id}.`, true)
    issue.comments.push({ author: "agent", text })
    save(issues)
    return reply(`Comment added to ${id}.`)
  },
)

await server.connect(new StdioServerTransport())
console.error(`tracker: serving ${file}`)
