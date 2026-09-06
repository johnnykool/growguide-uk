import { defineConfig } from "vitest/config";
import { configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    restoreMocks: true,
    // .worktrees holds sibling-branch checkouts (e.g. progressive-setup-polish)
    // that must not be discovered; this config intentionally diverges from the
    // sibling's to exclude them while preserving Vitest's built-in exclusions.
    exclude: [...configDefaults.exclude, "**/.worktrees/**"],
  },
  resolve: {
    alias: { "@": path.resolve(projectRoot, ".") },
  },
});
