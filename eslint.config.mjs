/**
 * ============================================================================
 * Lint — the mobile app
 * ============================================================================
 *
 * Deliberately one rule.
 *
 * This is not a general style config and should not grow into one: formatting
 * is not litigated here, and `typecheck` already catches everything a type
 * system can. What it adds is the single check neither of those can make —
 * that a string a learner reads came from the translation catalogue.
 *
 * `web/` has its own config (Next.js presets) and is not covered here. The
 * marketing pages there are deliberately English-only, so the same rule would
 * be hundreds of findings reporting the intended state of the world. The
 * learner-facing parts of the site are the ones worth extending this to, and
 * that is a follow-up rather than something to half-do now.
 */

import tsParser from '@typescript-eslint/parser';

import noUntranslatedText from './tools/eslint/no-untranslated-text.js';

export default [
  {
    ignores: [
      '**/node_modules/**',
      'dist/**',
      'web/**',
      'packages/core/**',
      'android/**',
      'ios/**',
      '.expo/**',
      'scripts/**',
    ],
  },
  {
    files: ['app/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      openmacro: { rules: { 'no-untranslated-text': noUntranslatedText } },
    },
    rules: {
      'openmacro/no-untranslated-text': [
        'error',
        {
          allow: [
            // The product's name is the same word in every language.
            'OpenMacro',
            // Code identifiers rendered in monospace. A file path is not
            // prose, and translating one would break the instruction it is
            // part of — the sentence around these two *is* translated, and
            // they are substituted into it as nodes by `interpolate`.
            'src/content/lessons/',
            'src/content/registry.ts',
          ],
        },
      ],
    },
  },
];
