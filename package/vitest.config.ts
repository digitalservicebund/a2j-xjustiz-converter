import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    includeSource: ["src/**/*.ts"],
    watch: false, // disable default
  },
  resolve: {
    tsconfigPaths: true,
  },
});
