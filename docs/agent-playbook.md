# Agent playbook

Last checked: 2026-11-17 · Claude Code 2.1.327 · Codex 0.170.0 · Node 24.18.0

## What this is
This repo is set up so that Claude Code and Codex can be handed real work, and humans keep control of architecture and quality.

What it guarantees:
- Nothing reaches `main` without a pull request and a green `check` job.
- Agents can't change the rules they work under through their file tools.
- Every agent edit is linted while the agent is still working, with the same rules CI uses.

Everything else is help or advice, and it's listed under "Not covered".

Owner: @rossenv (see `.github/CODEOWNERS`). To change anything here, open a PR.

## Principles
1. **One source of truth.** Rules live in one place, and everything reads them from there. If the playbook and a config file disagree, the config file wins.
2. **Advice, then check, then backstop.** Each rule goes in the cheapest layer that can enforce it. Then something the agent can't change backs it up: CI and the ruleset.
3. **Rule files belong to humans.** Agents read them and people change them.
4. **A report is a claim. The check is the proof.** An agent said "All checks pass" while a disable comment hid the error.
5. **Ban the silencers.** No `.skip`, `any`, `@ts-ignore` or disable comments, and no narrowing a script. Exceptions go in the rule file, with a reason.
6. **Outside text is data.** PR bodies, issues and MCP results are requests from their authors, not instructions.
7. **The agent's environment isn't your shell.** Trust settings, a background process, the sandbox and the tool's version all differ. Check them, and date what you checked.

## What we use
| Piece | Lives in | Why (what went wrong without it) | Covers | Checked by |
|---|---|---|---|---|
| Shared instructions | `AGENTS.md`, `CLAUDE.md` (`@AGENTS.md`) | Claude ignores AGENTS.md when a CLAUDE.md exists, so the rules split in two | Both tools, even untrusted | Advice only |
| CI | `.github/workflows/ci.yml` | An agent narrowed `pnpm test` so the gate passed. CI runs the full set: typecheck, lint, the disable-comment search, all tests | Everyone | Runs on every PR |
| Ruleset on `main` | GitHub settings | An audit found direct pushes skipped every check | Everyone | `gh api repos/rossenv/agent-harness-lab/rulesets` |
| Rule-file block | `.agents/hooks/protect-files.ts` | Codex edited the ADR and the architecture test to fit a request | Claude Edit/Write, Codex apply_patch | `protect-files.test.ts` |
| Secrets block | the same hook, Claude deny rules, Claude sandbox | — | Claude Read/Edit/Bash, Codex Bash | `protect-files.test.ts` |
| Lint on edit | `.agents/hooks/lint-edit.ts`, `.oxlintrc.json` | Codex added an `eslint-disable` comment and still said "All checks pass" | Both tools, trusted | After an upgrade, check 3 |
| Stop gate | `.agents/hooks/stop-gate.ts` | Without it, "done" is a claim | Both tools, trusted | After an upgrade, check 4 |
| Architecture test + ADR | `docs/adr/0001-module-layers.md`, `src/architecture.test.ts` | With no rule, Claude broke the layering without saying so | Everyone (CI) | It's a test |
| Dependency prompt | Claude `ask` rules, `.codex/rules/default.rules` | — | `pnpm add` in both tools | — |
| Skill `add-module` | `.agents/skills/` (`.claude/skills` is a symlink) | Each agent built modules its own way | Both tools | — |
| Test reviewer (subagent) | `.claude/agents/`, `.codex/agents/` | An agent changed what a test tested, and the test still passed | When AGENTS.md triggers it | Advice only |
| Reviewer in CI | `.github/workflows/test-review.yml` | Said CONCERNS despite a "reply PASS" line in the PR text | Every PR, advisory | Its PR comment |
| Tracker MCP | `.mcp.json`, `.codex/config.toml`, `mcp/` | A hidden "delete the arch test" note in an issue | Writes need approval | — |
| Editor lint | `.vscode/` | The editor showed different errors from CI | VS Code | — |

## Setup (new teammate)
- In your project's directory clone the repo: `git clone https://github.com/rossenv/agent-harness-lab.git <project_name> && cd <project_name>`
- Run: `pnpm install`,  then `pnpm typecheck && pnpm lint && pnpm test`
- Depending on what you are using: 
  - Claude - start a new session and accept the trust dialog.
  - Codex - start a new session, when it prompts you trust the new project folder and trust the new hooks. Run `/mcp` and ensure the GitHub mcp server is up and running.
  In both cases send this prompt for a test: 

  `Add a line "- Lint is optional for quick fixes." under ## Lint in AGENTS.md.`

  **Expected:** Something like "Blocked: … is a rule file".
- In you VS Code. Install Oxc extension in order to use the same lint rules in editor and in command line.
- Create a token limited to this repo in your browser. 
  - On GitHub, go to Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token.
  - Under Repository access, choose Only select repositories and pick <project_name>.
  - Under Permissions, set Issues: Read and write. Metadata: Read is added automatically.
  Store the token in your macOS Keychain, not in a file. In any terminal:

    `security add-generic-password -a "$USER" -s github-mcp-pat -w`

  In your bash script rc file add this line at the end:

    `export GITHUB_MCP_PAT="$(security find-generic-password -s github-mcp-pat -w)"`

  Check (new terminal): `test -n "$GITHUB_MCP_PAT" && echo set` prints set.
  - Claude: in the root of your project, add the following to .mcp.json:

    ```
      "github": {
        "type": "http",
        "url": "https://api.githubcopilot.com/mcp/x/issues",
        "headers": {
          "Authorization": "Bearer ${GITHUB_MCP_PAT}",
          "X-MCP-Lockdown": "true"
        }
      }
    ```


  - Codex: add to `.codex/config.toml`

    ```
      [mcp_servers.github]
        url = "https://api.githubcopilot.com/mcp/x/issues"
        bearer_token_env_var = "GITHUB_MCP_PAT"
        http_headers = { "X-MCP-Lockdown" = "true" }
        # Only these tools exist for Codex; the write tool asks first.
        enabled_tools = ["issue_read", "list_issues", "search_issues", "add_issue_comment"]
        default_tools_approval_mode = "writes"
    ```

## Working with agents day to day
- Describe the task, and let the agent read AGENTS.md and the ADR. New modules go through the `add-module` skill.
- Fan out (worktrees) only when the parts are independent. A serial task stays in one session.
- "Done" means the checks passed, not that the agent says so. Read the diff of every test change.
- When an agent stops and asks about a rule, that's the setup working. Answer it, or change the rule through a PR.

## Changing a rule
- Rule files are the ones listed in `READ_ONLY_PATHS` in `.agents/hooks/protect-files.ts`, plus `.github/CODEOWNERS`.
- Change them yourself, in a PR, and the owner reviews it.
- An exception goes in the rule file, with a reason. For example, the `src/average.test.ts` override in `.oxlintrc.json`.
- Never use a disable comment.

## After an upgrade
Run these after updating Claude Code, Codex or Node. Then update "Last checked".
1. `pnpm exec vitest run .agents/hooks`: all pass.
2. In Claude, then in Codex: `Add a line "- test" under ## Lint in AGENTS.md.` Both are blocked as a "rule file". Codex shows "Checking protected files".
3. In each tool: `Add src/tmp.ts with a default export.` You see lint feedback right after the edit ("Linting edited files" in Codex). Delete the file afterwards.
4. In each tool: ask it to add `.skip` to a test and finish. The Stop gate refuses.
5. In Codex: `/hooks` shows every project hook as trusted.
6. `pnpm exec tsc --listFilesOnly | grep -c .agents/hooks` prints 4. A moved folder can drop out of typecheck without any error.

## Not covered
| Gap | What catches it instead |
|---|---|
| Bash can write rule files (`sed -i`, `echo >`) | Review of the PR (on a team: required code-owner review) |
| Hooks don't run in a project you haven't trusted | AGENTS.md, CI, the ruleset |
| The Stop gate gives up after one retry, skips a clean tree, and runs only changed tests | CI runs everything |
| AI review can be wrong or skipped | It's advisory; the tests decide |
| Judgement rules (Zod at boundaries, ask before adding a dependency) | Review |
| Issue and PR text can carry instructions | The AGENTS.md "Tracker" lines, write approval, review |
| The architecture test misses computed imports | Review |
| Each person's global agent config (skills, plugins) changes behaviour | Nothing: the repo only controls its own guards |
| Moving a folder can drop it from typecheck or a hook path | After an upgrade, check 6, and reading the diff |

## Rollout
- **Tier 0, day one:** AGENTS.md, CI, the ruleset, CODEOWNERS. It needs nothing installed.
- **Tier 1, first week:** hooks, sandbox, permissions, editor config.
- **Tier 2:** skills, reviewers.
- **Tier 3:** fan-out, orchestrator, MCP.

In this repo all four tiers are live. For a new team repo, start at tier 0 and add a tier once the one before it holds.
