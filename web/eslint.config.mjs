import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import noUntranslatedText from "../tools/eslint/no-untranslated-text.js";

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
  {
    /**
     * The same rule the app runs, at `warn` rather than `error`.
     *
     * The app is at zero and gates on it. The site is not: the marketing copy,
     * the privacy notice and the glossary are still English, and turning this
     * red today would just mean turning it off. A warning keeps the real
     * number in front of whoever runs lint and lets it be driven down — flip
     * it to `error` when it reaches zero, the way `app` and `src` already are.
     */
    files: ["src/**/*.{ts,tsx}"],
    plugins: { openmacro: { rules: { "no-untranslated-text": noUntranslatedText } } },
    rules: {
      "openmacro/no-untranslated-text": [
        "warn",
        {
          // The brand is split across elements for two-tone styling. It is a
          // presentation detail, and the same word in every language.
          allow: ["OpenMacro", "Open", "Macro", "MacroXP", "MintBucks", "GitHub", "MIT"],
        },
      ],
    },
  },
]);

export default eslintConfig;
