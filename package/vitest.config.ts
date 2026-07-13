import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    includeSource: ["src/**/*.ts"],
    watch: false, // Disable default
  },
  resolve: {
    tsconfigPaths: true,
  },
});
