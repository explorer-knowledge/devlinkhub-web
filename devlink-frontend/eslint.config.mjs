import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // ── Noise reduction: downgrade non-critical rules ──────────────────────────
  // These generate hundreds of false-positive warnings on valid code patterns.
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "no-unused-vars": "off",               // let TS rule handle this
      "@typescript-eslint/no-explicit-any": "off",
      "react/display-name": "off",
      "import/no-anonymous-default-export": "off",
    },
  },
]);

export default eslintConfig;

