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

  // ---- features / philosophy ---------------------------------------------
  'features.overline': 'Features & philosophy',
  'features.title.lead': 'Personal finance teaches you to budget.',
  'features.title.mid': 'We teach you',
  'features.title.emphasis': 'the machine',
  'features.lede': 'Three convictions shape every lesson we ship.',
  'features.budgeting.title': 'Not Another Budgeting App',
  'features.budgeting.body':
    'Knowing to skip the daily coffee will not tell you why rent outran your raise. And “money basics” courses stop exactly where it gets interesting — at the point where you would have to open a central bank’s balance sheet.',
  'features.budgeting.theirsHeading': 'Budgeting apps ask',
  'features.budgeting.theirs.0': 'Where did my money go?',
  'features.budgeting.theirs.1': 'Can I afford this?',
  'features.budgeting.theirs.2': 'How much should I save?',
  'features.budgeting.oursHeading': 'OpenMacro asks',
  'features.budgeting.ours.0': 'Whose liability is this money?',
  'features.budgeting.ours.1': 'What settles when a payment clears?',
  'features.budgeting.ours.2': 'Which line on the Fed’s sheet just moved?',
  'features.openSource.title': '100% Open Source',
  'features.openSource.body':
    'Lessons are plain JSON — no React, no build step. An economist can write a T-account scenario in a text editor and open a pull request from the GitHub web UI.',
  'features.openSource.step.0': 'Fork the repo',
  'features.openSource.step.1': 'Drop a lesson file into src/content/lessons',
  'features.openSource.step.2': 'CI checks every sheet actually balances',
  'features.openSource.step.3': 'A maintainer reviews the economics',
  'features.educator.title': 'Parent & Educator Led',
  'features.educator.body':
    'Built with the people who will actually sit next to the learner. Classroom and kitchen-table tools are first-class features, not an enterprise upsell.',
  'features.educator.tracks.title': 'Custom tracks',
  'features.educator.tracks.body':
    "Reorder modules, hide what you have not covered yet, and pin a lesson as this week's homework.",
  'features.educator.prizes.title': 'Sponsored prize pools',
  'features.educator.prizes.body':
    'Fund a bounty for your class or your kid — books, hardware, or privileges. You set the goal and award it directly.',
  'features.educator.ledger.title': 'Non-custodial ledger',
  'features.educator.ledger.body':
    'The reward ledger lives on the learner’s device. No wallet, no real money, nothing to cash out.',

  // ---- the four-tier model ------------------------------------------------
  'tiers.overline': 'The model',
  'tiers.title.lead': 'Four balance sheets,',
  'tiers.title.mid': 'one',
  'tiers.title.emphasis': 'machine',
  'tiers.lede':
    "Money is somebody's liability at every level. OpenMacro teaches the whole hierarchy, not a cartoon of the top of it.",
  'tiers.tier': 'Tier {n, number}',
  'tiers.tierOf': 'Tier {n, number} · {subject}',
  'tiers.assets': 'Assets',
  'tiers.assetsHint': 'What it owns',
  'tiers.liabilities': 'Liabilities',
  'tiers.liabilitiesHint': 'What it owes',
  'tiers.levers': 'What you learn to operate',

  // ---- account ------------------------------------------------------------
  'account.signIn': 'Sign in',
  'account.opening': 'Opening Google',
  'account.signOut': 'Sign out',
  'account.openProgressA11y': '{name} — open your progress',
  'account.signOutOfA11y': "Sign out of {name}'s account",
  'account.signedIn': "You're signed in",
  'account.keepProgress': 'Keep your progress',
  'account.syncedBody':
    'XP and your day streak are saved to your account as you finish lessons, so they follow you to any device you sign in on.',
  'account.yourProgress': 'Your progress',
  'account.signedOutBody':
    'An account saves your XP and day streak so they survive closing the tab, and carries them to your phone. Signing in with Google creates it — there is no separate sign-up, and no password to remember.',
  'account.freeNotice':
    'Every lesson is free to play without an account — signing in only adds memory. We receive your name, email address and profile picture from Google, and nothing else. See our',
  'account.privacyLink': 'privacy notice',
} as const;
