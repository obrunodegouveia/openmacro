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

  // ---- animated balance sheet (home) --------------------------------------
  'sheet.eyebrow': 'Central bank balance sheet',
  'sheet.easing': 'Easing: buying bonds',
  'sheet.tightening': 'Tightening: holding steady',
  'sheet.qeOn': 'QE on',
  'sheet.qeOff': 'QE off',
  'sheet.total': 'Total',
  'sheet.note':
    'Both sides move together. The reserves the bank pays with are created on the spot — the sheet always balances.',
  'sheet.assets.bonds': 'Government bonds',
  'sheet.assets.loans': 'Loans to banks',
  'sheet.assets.fx': 'FX & gold',
  'sheet.liabilities.reserves': 'Bank reserves',
  'sheet.liabilities.currency': 'Currency in circulation',
  'sheet.liabilities.capital': 'Capital & other',

  // ---- contributor hub ----------------------------------------------------
  'contribute.overline': 'Contributor hub',
  'contribute.title.lead': 'A lesson is a',
  'contribute.title.emphasis': 'JSON file',
  'contribute.title.tail': 'That is the whole barrier.',
  'contribute.lede':
    'Economists, teachers and developers all contribute the same way: one file, one pull request. Encode a central bank operation as postings, and the app plays it.',
  'contribute.validated': 'Validated in CI against',
  'contribute.validatedBy': 'by',
  'contribute.validatedTail':
    'which rejects any scenario whose expected postings leave a balance sheet unbalanced — the mistake every first-time contributor makes.',
  'contribute.live': 'Live from GitHub',
  'contribute.awaiting': 'Awaiting first release',
  'contribute.stars': 'GitHub stars',
  'contribute.prs': 'Open PRs',
  'contribute.contributors': 'Contributors',
  'contribute.forks': 'Forks',
  'contribute.countersNote':
    'Counters go live the moment the repository is public. Until then we would rather show a dash than a number we made up.',
  'contribute.startHere': 'Start here',
  'contribute.goodFirst': 'Good first issues are labelled',
  'contribute.goodFirstTail':
    'Bring the economics; we will help with the tooling. Reviews are about the mechanism, not the syntax.',
  'contribute.viewRepo': 'View the repo',
  'contribute.joinDiscord': 'Join Discord',
  'contribute.guide': 'Contributing guide',
  'contribute.browseLessons': 'Browse lessons',
  'contribute.openIssues': 'Open issues',

  // ---- playable teaser ----------------------------------------------------
  'demo.overline': 'Playable teaser',
  'demo.title.lead': 'Don’t read about QE.',
  'demo.title.emphasis': 'Post the entries.',
  'demo.lede':
    'This is a real lesson step, graded by the same engine the app uses: place each entry on the right sheet and the right side, then find out what actually moved. No sign-up, no download.',
  'demo.correct': 'That is the operation.',
  'demo.wrong': 'Not quite — try the full lesson.',
  'demo.prompt': 'Place every entry, then check.',
  'demo.reset': 'Reset',
  'demo.check': 'Check entries',
  'demo.note':
    'Simplified in one respect: the dealer’s own sheet is left off screen to keep two T-accounts on a phone. In the app the dealer appears as a third entity, and the same operation is replayed with randomised counterparties and amounts so the answer cannot be memorised.',

  // ---- syllabus -----------------------------------------------------------
  'roadmap.overline': 'Syllabus',
  'roadmap.title': '{count} tracks, from',
  'roadmap.title.first': 'tax liabilities',
  'roadmap.title.to': 'to',
  'roadmap.title.second': 'swap lines',
  'roadmap.lede':
    'Each track builds the mechanism the next one depends on, and every one of them ends in a balance sheet you post yourself.',
  'roadmap.live': 'Live in beta',
  'roadmap.beta': 'In testing',
  'roadmap.drafting': 'Being written',
  'roadmap.planned': 'Planned',

  // ---- rewards ------------------------------------------------------------
  'rewards.overline': 'The incentive loop',
  'rewards.title.lead': 'The knowledge is free.',
  'rewards.title.mid': 'The',
  'rewards.title.emphasis': 'retention',
  'rewards.title.tail': 'is the product.',
  'rewards.lede':
    'Every central bank publishes its balance sheet. Almost nobody reads one twice. Rewards exist to fix that, and they are earned by demonstrating the mechanism — never by showing up.',
  'rewards.competency.title': 'Proof of Competency',
  'rewards.competency.body':
    'Adaptive micro-tests and T-account scenarios with randomised parameters. The same operation comes back with different counterparties and amounts, so memorising an answer key gets you nowhere.',
  'rewards.points.title': 'MacroXP & MintBucks',
  'rewards.points.body':
    'Points earned only through verified mastery, daily analysis streaks and module completions. Non-inflationary by design: there is no way to buy them, farm them, or trade them.',
  'rewards.credentials.title': 'Tiered Credentials',
  'rewards.credentials.body':
    'Cryptographic attestations for a demonstrated skill — “Open-Market Operations Specialist”, “Balance Sheet Mechanic: ECB Architecture”. Verifiable by anyone, issued only against a passed assessment.',
  'rewards.prizes.title': 'Prize Pools & Bounties',
  'rewards.prizes.body':
    'Sponsored by parents, educators and the community: books (Mehrling, Bagehot, Stigum), hardware, or family-set privileges. Sponsors fund and award them directly — never the platform.',
  'rewards.notTitle': 'What points are not',
  'rewards.notBody':
    'MacroXP and MintBucks are a learning score. They are not currency, not a token you can buy or sell, and there is no exchange, wallet or cash-out path anywhere in the product. Prize pools are funded and awarded by the sponsor who created them — a parent, a school, a community — and OpenMacro never takes custody of the money. Nothing here is a wager, and nothing costs a learner anything to enter.',

  // ---- footer link groups -------------------------------------------------
  'footer.group.learn': 'Learn',
  'footer.group.build': 'Build',
  'footer.group.legal': 'Legal',
  'footer.link.demo': 'Web demo',
  'footer.link.learn': 'Learn about money',
  'footer.link.teach': 'Teach kids about money',
  'footer.link.syllabus': 'Syllabus',
  'footer.link.model': 'The model',
  'footer.link.glossary': 'Glossary',
  'footer.link.repo': 'GitHub repository',
  'footer.link.contributing': 'Contributing guide',
  'footer.link.issues': 'Open issues',
  'footer.link.privacy': 'Privacy & COPPA notice',
  'footer.link.licence': 'MIT licence',

  // ---- for parents & educators --------------------------------------------
  'teach.overline': 'For parents & educators',
  'teach.title.lead': 'How to teach kids what money',
  'teach.title.emphasis': 'really is',
  'teach.lede':
    'Pocket money teaches discipline. It does not explain why prices rise or where a bank loan comes from — and children ask those questions long before they earn anything. This is what to teach, roughly when, and how to say it.',
  'teach.badge.free': 'Free, no licence to buy',
  'teach.badge.noAccounts': 'No child accounts',
  'teach.badge.noAds': 'No ads, no tracking',
  'teach.stagesTitle': 'What to introduce, and when',
  'teach.stagesLede':
    'Ages are guidance, not gates. A curious nine-year-old who asks where money comes from is ready for the answer.',
  'teach.stage.1.age': 'Ages 7–9',
  'teach.stage.1.idea': 'Money is a promise, not a thing',
  'teach.stage.1.body':
    'A coin is not valuable because of the metal. It works because everyone accepts it and the state stands behind it. Ask what would happen if a shop stopped accepting it — that question does most of the teaching.',
  'teach.stage.2.age': 'Ages 10–12',
  'teach.stage.2.idea': 'Banks write money when they lend',
  'teach.stage.2.body':
    'Ask where a bank gets the money for a loan. When they answer “from savers”, show them that no saver\u2019s balance falls. The number in the borrower\u2019s account is new, and it was typed.',
  'teach.stage.3.age': 'Ages 13–16',
  'teach.stage.3.idea': 'Someone sets the price of money',
  'teach.stage.3.body':
    'Interest rates are decided by a committee, and that decision reaches their family\u2019s rent or mortgage. Teenagers who have noticed prices rising find this more compelling than budgeting advice.',
  'teach.stage.4.age': 'Ages 16+',
  'teach.stage.4.idea': 'The whole machine',
  'teach.stage.4.body':
    'Central bank balance sheets, quantitative easing, the offshore dollar system. At this point they can post the entries themselves and check a claim against a Federal Reserve source.',
  'teach.questionsTitle': 'Questions parents and teachers ask',
  'teach.safetyTitle': 'What we collect from your child',
  'teach.safety.1':
    'Nothing, unless they sign in. Every lesson plays in full without an account, and signed out, progress and streaks stay on the device and are never uploaded.',
  'teach.safety.2': 'No analytics, advertising or third-party tracking scripts.',
  'teach.safety.3':
    'Signing in is optional and needs a Google Account, which Google does not issue to under-13s. It saves one thing: their XP and day streak, so those follow them to another device.',
  'teach.safety.4':
    'Reward points are a learning score — not money, not a wallet, with no way to buy or cash them out.',
  'teach.safety.5':
    'Accounts and progress are stored in the EU (Ireland), and one learner can never read another\u2019s.',
  'teach.readPrivacy': 'Read the full privacy and COPPA notice',
  'teach.tryLesson': 'Try a lesson yourself first',
  'teach.learnYourself': 'Learn it yourself',

  // ---- learn page ---------------------------------------------------------
  'learn.overline': 'Start here',
  'learn.title.lead': 'How to learn what money',
  'learn.title.emphasis': 'actually is',
  'learn.lede':
    'Most money is not printed by a government. It is created by commercial banks when they lend, and by central banks when they buy assets. Everything else follows from that, and this is the shortest honest path to understanding it.',
  'learn.pathTitle': 'The path, in order',
  'learn.step.1.title': 'Play one real operation, before reading anything',
  'learn.step.1.body':
    'The demo gives you a $10B central bank purchase and asks you to post the entries on both balance sheets. Ten minutes here makes every article about the Fed readable.',
  'learn.step.1.cta': 'Open the demo',
  'learn.step.2.title': 'Learn the vocabulary as mechanisms, not definitions',
  'learn.step.2.body':
    'Reserves, repo, the monetary base, quantitative easing. Each glossary entry explains what moves on whose balance sheet, names the usual misconception, and links the primary source.',
  'learn.step.2.cta': 'Read the glossary',
  'learn.step.3.title': 'Work through the {count} tracks in order',
  'learn.step.3.body':
    "From what makes an unbacked token acceptable, through commercial banking and the Fed and ECB levers, to how a dollar crisis is contained — and finally the Fed's own balance sheet, as published this week. Each track builds the mechanism the next one needs.",
  'learn.step.3.cta': 'See the syllabus',
  'learn.questionsTitle': 'Common questions',
  'learn.teachingTitle': 'Teaching someone else?',
  'learn.teachingBody':
    'There is a separate guide for parents, guardians and teachers, covering what to introduce at what age and how to explain inflation and bank money to a child.',
  'learn.teachingCta': 'How to teach kids about money',

  // ---- glossary -----------------------------------------------------------
  'glossary.back': 'Back to openmacro.org',
  'glossary.overline': 'Reference',
  'glossary.lede':
    'Every definition here describes a mechanism as balance sheet movements, names the misconception it usually carries, and links the primary source. Precision is the product.',
  'glossary.read': 'Read the mechanism',

  // ---- login --------------------------------------------------------------
  'login.title': 'Sign in to OpenMacro',
  'login.body':
    'Your account does one thing: it remembers. XP and your day streak follow you to any device you sign in on.',

  // ---- not found ----------------------------------------------------------
  'notFound.title': 'This page does not balance.',
  'notFound.body':
    'The URL you followed does not exist. It may have moved, or it may never have been here.',
  'notFound.home': 'Back to the home page',
  'notFound.glossary': 'Browse the glossary',

  // ---- module briefs (working material) -----------------------------------
  'briefs.overline': 'Working material',
  'briefs.title.lead': 'One brief per module, ready to',
  'briefs.title.emphasis': 'turn into a video',
  'briefs.lede':
    'Each link below returns that module as plain text: the questions it answers, the mechanism behind each one, the misconceptions with their rebuttals, and the takeaways. Paste a link into NotebookLM as a website source and ask it for a Video Overview.',
  'briefs.lessons': '{count, plural, one {# lesson} other {# lessons}}',
  'briefs.videoLive': 'video live',
  'briefs.videoNone': 'no video yet',
  'briefs.howTitle': 'How to make one',
  'briefs.step.1': '1. Open NotebookLM and add the module link above as a website source.',
  'briefs.step.2': '2. Ask for a Video Overview. The headings in the brief become the slides.',
  'briefs.step.3': '3. Publish the result somewhere with a stable URL.',
  'briefs.step.4': '4. Add it to the module in',
  'briefs.step.4.as': 'as',
  'briefs.step.4.tail': ', and it appears above that module’s lessons.',
  'briefs.noApi':
    'There is no API for this yet — Google’s notebook API is enterprise-only and does not expose video generation — so step two is done by hand, once per module. The briefs are the part worth automating and they are generated from the course itself, so they cannot describe a lesson that no longer exists.',
  'briefs.privacy':
    'Videos are embedded without contacting YouTube until a learner presses play, so the privacy notice stays true for anyone who does not watch. See',
  'briefs.privacyLink': 'the privacy notice',

  // ---- a glossary entry ---------------------------------------------------
  'term.allTerms': 'All terms',
  'term.mechanics': 'The mechanics',
  'term.misreading': 'The common misreading',
  'term.related': 'Related terms',
  'term.sources': 'Primary sources',
  'term.postIt': 'Post it yourself',
  'term.postItBody':
    'Reading a definition is not the same as being able to work the mechanism. The demo gives you a real operation and asks you to place the entries.',
  'term.tryDemo': 'Try the T-account demo',

  // ---- privacy & COPPA notice ---------------------------------------------
  'privacy.back': 'Back to openmacro.org',
  'privacy.title': 'Privacy & children’s privacy notice',
  'privacy.updated': 'Last updated 5 September 2026. Covers {domain} and the OpenMacro mobile app.',
  'privacy.authoritative': '',
  'privacy.short.title': 'The short version',
  'privacy.short.body':
    'You can read every page, play every simulation and finish every lesson on this site without an account, and we do not run analytics, advertising or third-party tracking scripts. If you choose to sign in with Google, we save your XP and day streak so they follow you between devices — that is the only reason an account exists, and the only personal data we hold.',
  'privacy.collect.title': 'What we collect',
  'privacy.collect.google.label': 'If you sign in with Google.',
  'privacy.collect.google.body':
    'Google sends us your name, email address, profile picture and your Google account identifier. We store your name against your progress, and the email address is held by our authentication provider so you can sign back in.',
  'privacy.collect.progress.label': 'Your progress, once signed in.',
  'privacy.collect.progress.body':
    'Total XP, your day streak, the date of your last completed lesson, and for each lesson your best score, how many times you have finished it and when. No answers, no timings, nothing about how you played.',
  'privacy.collect.logs.label': 'Server logs.',
  'privacy.collect.logs.body':
    'Our host records standard request logs — IP address, timestamp, requested path, user agent — to keep the service running and to block abuse. These are retained for 30 days and then deleted.',
  'privacy.collect.sim.label': 'Nothing from the simulator.',
  'privacy.collect.sim.body':
    'The slider, the readouts and the lending chain all run in your browser. Your inputs are never sent to us.',
  'privacy.notCollect.title': 'What we do not collect',
  'privacy.notCollect.1': 'No cookies for advertising, profiling or cross-site tracking.',
  'privacy.notCollect.2': 'No analytics or session-recording services.',
  'privacy.notCollect.3':
    'No addresses, phone numbers or payment details. We never ask for a password: Google handles sign-in, so there is none for us to hold.',
  'privacy.notCollect.4': 'No selling, renting or trading of any data, ever.',
  'privacy.coppa.title': 'Children under 13 (COPPA)',
  'privacy.coppa.intro':
    'OpenMacro is written for young adults and kids, so we treat children’s privacy as a design constraint rather than a policy page.',
  'privacy.coppa.1':
    'No account is needed to learn. Every lesson, on the site and in the app, plays in full without signing in, and while you are signed out progress stays on the device and is never uploaded.',
  'privacy.coppa.2':
    'Signing in is optional and requires a Google Account, which Google does not issue to children under 13 — and under 16 in some countries. A child using a Family Link account signs in only with their parent’s approval.',
  'privacy.coppa.3.lead':
    'We do not knowingly collect personal information from children under 13. If you believe a child has signed in, write to',
  'privacy.coppa.3.tail': 'and we will delete the account and everything attached to it.',
  'privacy.coppa.4':
    'MacroXP and MintBucks are a learning score. They are not currency, not a wallet, and cannot be exchanged, transferred or cashed out. There is no purchase path anywhere in the product.',
  'privacy.coppa.5':
    'Skill credentials are issued only when a learner asks for one, and for anyone under 13 only with a parent or guardian. We do not publish a child’s attainment, name or identifier to any public ledger or third-party registry.',
  'privacy.coppa.6':
    'Prize pools are created, funded and awarded by the sponsor — a parent, a school or a community group. OpenMacro never takes custody of the money and never handles a payout. Entry is always free, and nothing in the product is a wager.',
  'privacy.coppa.7':
    'There is no advertising, no in-app purchasing, and no chat or other child-to-stranger communication anywhere in the product.',
  'privacy.coppa.8':
    'No proof of identity is required to ask for a deletion, and we never ask a child to prove anything before honouring one.',
  'privacy.where.title': 'Where the data lives',
  'privacy.where.1':
    'The website runs on Google Cloud Run. Accounts and progress are stored with Supabase, in their West EU (Ireland) region — learner data does not leave the EU. Sign-in itself is handled by Google.',
  'privacy.where.2':
    'Every row is protected by database row-level security keyed to your account, so one learner cannot read another’s progress, and the key shipped in the website can only ever reach your own rows. We keep your progress until you ask us to delete it.',
  'privacy.choices.title': 'Your choices',
  'privacy.choices.1': 'Sign out at any time. You can keep using every lesson signed out.',
  'privacy.choices.2.lead': 'Email',
  'privacy.choices.2.tail':
    'to see, correct or delete what we hold, including your whole account. We answer within 30 days.',
  'privacy.choices.3.lead': 'You can also revoke OpenMacro’s access from your',
  'privacy.choices.3.link': 'Google account permissions',
  'privacy.choices.4':
    'Delete the app to erase on-device progress. If you never signed in, nothing survives on our side.',
  'privacy.changes.title': 'Changes and questions',
  'privacy.changes.lead':
    'Material changes will be posted here with a new date. This notice lives in the same open-source repository as the site, so its full history is public — read it on',
  'privacy.changes.tail': '. Questions go to',

  // ---- treasury (admin) ---------------------------------------------------
  'treasury.loading': 'Loading…',
  'treasury.notFound': 'Not found',
  'treasury.denied': 'There is nothing here for this account.',
  'treasury.loadError': 'Could not load the treasury.',
  'treasury.title': 'Treasury',
  'treasury.signedInAs': 'Signed in as {email}',
  'treasury.funds': 'Funds',
  'treasury.eurc': 'EURC',
  'treasury.eth': 'ETH (gas)',
  'treasury.topUp': 'Top up this address',
  'treasury.copy': 'Copy',
  'treasury.networkWarning.lead': 'Send EURC and ETH on',
  'treasury.networkWarning.tail':
    'only. The same address on another network will not arrive and cannot be recovered.',
  'treasury.attention': 'Needs attention',
  'treasury.attentionBody':
    'These stopped between broadcasting and recording. Look up the nonce on the treasury address in BaseScan: if a transaction exists the money moved, if not it did not. Do not retry the payment — a pending transaction can still be mined.',
  'treasury.nonce': 'nonce',
  'treasury.wasPaid': 'It was paid',
  'treasury.neverSent': 'It never sent',
  'treasury.recipients': 'Who can be paid',
  'treasury.recipientsBody.lead': 'A new address starts',
  'treasury.recipientsBody.pending': 'pending',
  'treasury.recipientsBody.tail':
    'and cannot receive a game reward. Send a test, confirm it arrived in their Coinbase account, then activate it.',
  'treasury.perModule': '€{amount} per module',
  'treasury.defaultAmount': 'default amount',
  'treasury.claimedBy': 'claimed by {email}',
  'treasury.unbound': 'no account bound — nobody can earn into this wallet',
  'treasury.sending': 'Sending…',
  'treasury.testSend': 'Send €1 test',
  'treasury.activate': 'Activate',
  'treasury.disable': 'Disable',
  'treasury.nobody': 'Nobody yet.',
  'treasury.payouts': 'Recent payouts',
  'treasury.baseScan': 'BaseScan ↗',
  'treasury.noPayouts': 'No payouts yet.',
  'treasury.adminLog': 'Admin log',
  'treasury.noLog': 'Nothing recorded yet.',
  'treasury.addRecipient': 'Add a recipient',
  'treasury.field.key': 'Key (used by the game)',
  'treasury.field.keyPlaceholder': 'daughter',
  'treasury.field.name': 'Name',
  'treasury.field.namePlaceholder': 'Sofia',
  'treasury.field.address': 'Coinbase deposit address on Base',
  'treasury.field.amount': 'Reward per module in euros (optional)',
  'treasury.field.claimant': 'Account that claims into it',
  'treasury.field.claimantPlaceholder': 'her@email.com',
  'treasury.field.note': 'Note (optional)',
  'treasury.addedPending':
    'Added as pending. It cannot receive a reward until you send a test and activate it.',
  'treasury.add': 'Add',
  'treasury.cancel': 'Cancel',

  // ---- dashboard ----------------------------------------------------------
  'dash.noBackend.lead':
    'This build has no account backend configured, so there is no progress to show. Every lesson still plays — see',
  'dash.noBackend.link': 'the course',
  'dash.nothingYet': 'Nothing finished yet — pick anything below.',
  'dash.finished': '{done, number} of {total, number} lessons finished',
  'dash.signOut': 'Sign out',
  'dash.loadFailed':
    'Could not load your progress just now. Your lessons still play — try reloading the page.',
  'dash.progressAria': 'Your progress',
  'dash.totalXp': 'Total XP',
  'dash.dayStreak': 'Day streak',
  'dash.courseComplete': 'Course complete',
  'dash.lessonsOf': '{done, number} of {total, number} lessons',
  'dash.continueAria': 'Continue',
  'dash.startHere': 'Start here',
  'dash.pickUp': 'Pick up where you left off',
  'dash.allDone': 'Every lesson finished.',
  'dash.allDoneBody':
    'Replay any of them to raise a best score — or write one, since the content is open source.',
  'dash.onDevice': 'This is kept on this device',
  'dash.onDeviceBody':
    'Everything above is saved in this browser. Signing in keeps it if you clear your browser, and carries it to your phone — what you have already done is folded in, not replaced.',
  'dash.allModulesAria': 'All modules',
  'dash.moduleProgressAria': '{title} progress',
  'dash.best': 'Best {best, number} / {max, number} XP',
  'dash.runs': '· {count, number} runs',
  'dash.xpAvailable': '{max, number} XP available',
  'dash.fullMarks': 'Full marks',
  'dash.replay': 'Replay',

  // ---- module rewards -----------------------------------------------------
  'moduleRewards.title': 'Rewards',
  'moduleRewards.rate': '{amount} a module · €{earned} earned',
  'moduleRewards.body':
    'Finish every lesson in a module and the reward is yours, paid in EURC straight to your Coinbase account.',
  'moduleRewards.ready': '{count, number} ready to claim',
  'moduleRewards.lessons': '{done, number} of {total, number} lessons',
  'moduleRewards.paidLink': 'Paid ↗',
  'moduleRewards.paid': 'Paid',
  'moduleRewards.sending': 'Sending…',
  'moduleRewards.claim': 'Claim €{amount}',
} as const;
