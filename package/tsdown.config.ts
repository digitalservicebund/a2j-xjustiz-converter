import { type UserConfig } from "tsdown";

export default {
  dts: true,
  platform: "neutral",
  entry: {
    "nachricht/zahlungsklage": "./src/nachricht/zahlungsklage/index.ts",
  },
  publint: true,
} satisfies UserConfig;
