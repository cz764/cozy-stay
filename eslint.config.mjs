import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Codegen output – regenerated, never hand-edited.
    "src/gql/**",
    // Build-time tool; uses require/eval by design.
    "scripts/generate-seed.cjs",
  ]),
]);

export default eslintConfig;
