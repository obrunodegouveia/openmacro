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
     * The same rule the app runs, and now at the same severity.
     *
     * Everything a reader can see is in the catalogue. What is listed below is
     * the residue the rule cannot tell apart from prose:
     *
     * • Code identifiers rendered in monospace — a file path, an npm script,
     *   a GitHub label, a field name. Translating one would break the
     *   instruction it belongs to. The sentence around them *is* translated.
     * • The network name "Base" and the domain, which are proper nouns.
     * • `aria-label={props["aria-label"]}` in the slider, which is a prop
     *   being forwarded rather than a string being written.
     *
     * The Open Graph images are the one real gap and are deliberately left:
     * they are social cards baked at build time by one route per page, with
     * no locale in scope. A Portuguese card needs a second image route, which
     * is a feature rather than a translation.
     */
    files: ["src/**/*.{ts,tsx}"],
    plugins: { openmacro: { rules: { "no-untranslated-text": noUntranslatedText } } },
    rules: {
      "openmacro/no-untranslated-text": [
        "error",
        {
          allow: [
            // The brand, split across elements for two-tone styling.
            "OpenMacro",
            "Open",
            "Macro",
            "MacroXP",
            "MintBucks",
            "GitHub",
            "MIT",
            // Proper nouns.
            "Base",
            "openmacro.org",
            // Code identifiers, rendered as code.
            "packages/core",
            "packages/core/src/content/schema.ts",
            "npm run lint:content",
            "good-first-lesson",
            "/modules/",
            "video:",
            "url, minutes, source",
            "aria-label",
            // Open Graph cards: build-time images, English by design.
            "Understand the Machine",
            "Behind",
            "Money.",
            "MIT licensed",
            "/ glossary",
            "Tier",
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
