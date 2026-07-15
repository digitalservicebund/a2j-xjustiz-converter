import { defineConfig } from "vitest/config";

// oxlint-disable-next-line no-default-export -- required by tsdown
export default defineConfig({
  test: {
    includeSource: ["src/**/*.ts"],
    watch: false, // Disable default
  },
  resolve: {
    tsconfigPaths: true,
  },
});
