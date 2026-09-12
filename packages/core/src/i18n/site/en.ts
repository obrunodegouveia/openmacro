/**
 * Website copy — English, the source language.
 *
 * Keys are namespaced by surface (`nav.`, `hero.`, `footer.`) so a reader of
 * either catalogue can tell at a glance what a string is for, and so a whole
 * surface can be found and reviewed together.
 *
 * The brand is never a key. "OpenMacro" is the same word in every language,
 * and the two-tone rendering splits it across elements for styling — which is
 * a presentation detail, not a sentence.
 */
export const en = {
  // ---- navigation ---------------------------------------------------------
  'nav.aria': 'Main',
  'nav.demo': 'Live demo',
  'nav.learn': 'Learn',
  'nav.teach': 'For parents',
  'nav.glossary': 'Glossary',
  'nav.syllabus': 'Syllabus',
  'nav.contribute': 'Contribute',
  'nav.dashboard': 'Dashboard',
  'nav.github': 'GitHub',
  'nav.openMenu': 'Open menu',
  'nav.closeMenu': 'Close menu',

  // ---- hero ---------------------------------------------------------------
  'hero.title.lead': 'Understand the',
  'hero.title.emphasis': 'Machine',
  'hero.title.tail': 'Behind Money.',
  'hero.subtitle':
    'The open-source, gamified platform teaching macroeconomics, central banking, and credit creation — one balance sheet entry at a time.',
  'hero.start': 'Start learning',
  'hero.continue': 'Continue learning',
  'hero.signInA11y': 'Sign in to start learning',
  'hero.or': 'Or',
  'hero.browse': 'browse all {count, number} lessons',
  'hero.noAccount': '— no account needed.',
  'hero.openSource': 'Open source · MIT licensed · Built with educators',

  // ---- footer -------------------------------------------------------------
  'footer.aria': 'Footer',
  'footer.allLessons': 'All lessons',
  'footer.glossary': 'Glossary',
  'footer.privacy': 'Privacy',
  'footer.contributors': 'contributors. Educational content only —',
  'footer.mit': 'MIT',
  'footer.mitLicensed': 'MIT licensed',
  'footer.coppa': 'COPPA-conscious by design',
  'footer.rewards': 'Non-custodial rewards',
  'footer.mitBody':
    'Code and lessons are free to use, fork, translate and teach from — commercially included.',
  'footer.coppaBody':
    'No account is required to learn, no behavioural ads, and no personal data collected from children under 13.',
  'footer.rewardsBody':
    'MacroXP and MintBucks are a learning score, kept on-device unless you sign in to sync it. Prize pools are funded and awarded by their sponsor — we never hold the money.',
  'footer.disclaimer': 'nothing here is financial advice.',
  'footer.githubA11y': 'OpenMacro on GitHub',
  'footer.chatA11y': 'OpenMacro community chat',
} as const;
