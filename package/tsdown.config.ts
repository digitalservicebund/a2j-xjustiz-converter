import { type UserConfig } from "tsdown";

// oxlint-disable-next-line no-default-export -- required by tsdown
export default {
  dts: true,
  platform: "neutral",
  entry: {
    "nachricht/zahlungsklage": "./src/nachricht/zahlungsklage/index.ts",
  },
  publint: true,
} satisfies UserConfig;
