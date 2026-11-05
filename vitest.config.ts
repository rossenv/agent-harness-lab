import { configDefaults, defineConfig } from "vitest/config"

// Agent worktrees live inside the repo; don't run their copies of the tests.
export default defineConfig({
  test: { exclude: [...configDefaults.exclude, ".claude/worktrees/**"] },
})
