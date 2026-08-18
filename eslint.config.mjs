import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// eslint-config-next still publishes eslintrc-style configs; FlatCompat
// bridges them into ESLint 9 flat config until Next ships them natively.
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // Codegen output — regenerated, never hand-edited.
      "src/gql/**",
      // Build-time tool; uses require/eval by design.
      "scripts/generate-seed.cjs",
    ],
  },
];

export default eslintConfig;
