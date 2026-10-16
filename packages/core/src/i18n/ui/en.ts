/**
 * ============================================================================
 * Interface strings — English, and the source of truth
 * ============================================================================
 *
 * Shared by the app, the website and the grading engine, so a phrase is
 * translated once rather than once per platform and then differently.
 *
 * Keys are namespaced by where they appear. They are deliberately not the
 * English text: a key of `account.signOut` survives a copy edit, whereas a key
 * of "Sign out" means every translation breaks the day somebody prefers "Log
 * out". Keeping them apart is what lets English be edited freely.
 *
 * `{placeholders}` are substituted at render. They carry no formatting, so a
 * translator never has to reproduce markup correctly to avoid breaking a page.
 *
 * Accessibility labels live here too. A screen reader user who has set their
 * phone to Portuguese and hears "Start lesson: Como o dinheiro é criado" read
 * in English is having a worse time than a sighted user, not an equal one.
 */
export const en = {
  // ---- account ----------------------------------------------------------
  'account.signIn': 'Continue with Google',
  'account.signOut': 'Sign out',
  'account.signOutOf': 'Sign out of {name}’s account',
  'account.optional':
    'Optional — you can learn without an account. Signing in keeps your streak and XP across devices, and brings the progress on this one with you.',
  'account.sync.merging': 'Merging your offline progress…',
  'account.sync.pushing': 'Syncing…',
  'account.sync.pending': 'Saved on this device · syncs when you’re back online',
  'account.sync.synced': 'Progress synced to your account',

  'account.delete': 'Delete account',
  'account.delete.open': 'Delete your account',
  'account.delete.title': 'Delete this account',
  'account.delete.body':
    'Your XP, streak and lesson history are erased and cannot be recovered. The course keeps working on this device, signed out.',
  'account.delete.accountIs': 'This account signs in as',
  'account.delete.confirmLabel': 'Type {email} to confirm',
  'account.delete.confirmLabelGeneric': 'Type your email address to confirm',
  'account.delete.placeholder': 'your email',
  'account.delete.keep': 'Keep it',
  'account.delete.confirm': 'Delete for good',
  'account.delete.confirmA11y': 'Permanently delete this account',
  'account.delete.busy': 'Deleting…',
  'account.delete.failed': 'That did not work.',
  'account.delete.unreachable': 'Could not reach the server.',
  'account.delete.expired': 'Your session expired. Sign in again.',

  // ---- the learning path -------------------------------------------------
  'tabs.home': 'Home',
  'tabs.progress': 'Progress',
  'tabs.account': 'Account',

  // ---- navigation: Today, Course, module pages, Profile -----------------
  'tabs.today': 'Today',
  'tabs.course': 'Course',
  'tabs.profile': 'Profile',
  'today.continue': 'Continue',
  'today.start': 'Start the course',
  'today.eyebrowContinue': 'Pick up where you left off',
  'today.eyebrowStart': 'Your first lesson',
  'today.where': '{level} · Module {number, number}',
  'today.moduleProgress': '{done, number} of {total, number} lessons in this module',
  'today.openModule': 'See the whole module',
  'today.upNext': 'Next in this module',
  'today.browse': 'Browse all {count, number} modules',
  'today.allDone': 'You have finished the whole course',
  'today.allDoneBody': 'Review keeps it from fading, and any lesson can be replayed from the Course tab.',
  'course.title': 'Course',
  'course.search': 'Search modules and lessons',
  'course.searchClear': 'Clear search',
  'course.noResults': 'Nothing matches “{query}”',
  'course.results.modules': 'Modules',
  'course.results.lessons': 'Lessons',
  'course.moduleMeta': '{done, number}/{total, number} lessons · {minutes, number} min',
  'course.moduleA11y': 'Module {number, number}: {title}. {done, number} of {total, number} lessons finished.',
  'course.levelProgress': '{done, number} of {total, number} modules finished',
  'course.current': 'You are here',
  'module.lessons': 'Lessons',
  'module.continue': 'Continue · {title}',
  'module.start': 'Start this module',
  'module.replay': 'Replay from the first lesson',
  'module.stats': '{count, plural, one {# lesson} other {# lessons}} · {minutes, number} min',
  'module.notFound': 'That module does not exist.',
  'lesson.status.done': 'Finished',
  'lesson.status.next': 'Up next',
  'lesson.status.upcoming': 'Not started',
  'lesson.exitConfirm.title': 'Leave this lesson?',
  'lesson.exitConfirm.body': 'The answers you gave in this run will be lost.',
  'lesson.exitConfirm.leave': 'Leave',
  'lesson.exitConfirm.stay': 'Keep going',
  'complete.nextNamed': 'Next lesson · {title}',
  'complete.backToModule': 'Back to the module',
  'complete.moduleDone': 'Module complete',
  'complete.moduleDoneBody': 'You finished every lesson in {module}.',
  'complete.nextModule': 'Start the next module',
  'profile.title': 'Profile',
  'profile.about': 'About',
  'profile.coursePercent': '{percent, number}% of the course',
  'profile.about.title': 'Free and open source',
  'profile.about.body': 'Written in the open. New lessons are added as they are finished, and anyone can propose one.',
  'profile.about.github': 'See the course on GitHub',

  'progress.title': 'Progress',
  'progress.stat.xp': 'XP earned',
  'progress.stat.lessons': 'of {total, plural, one {# lesson} other {# lessons}}',
  'progress.stat.streak': 'Day streak',
  'progress.module.count': '{done, number} / {total, number}',
  'progress.memory.title': 'Memory',
  'progress.memory.blurb':
    'What the course has seen you get wrong, and when it plans to ask again. This never leaves your device.',
  'progress.memory.tracked': 'tracked',
  'progress.memory.week': 'due this week',
  'progress.memory.lapsed': 'gone rusty',
  'progress.memory.weakest': 'Shakiest right now',

  'account.title': 'Account',
  'account.danger': 'Danger zone',

  'path.xp': '{count, number} XP',
  'path.module': 'Module {number, number}',
  /**
   * Progress on a module whose lessons are collapsed out of sight.
   *
   * A collapsed row has to carry the thing the learner opened the screen to
   * find out. Without it, collapsing hides exactly the information that makes
   * the list worth scanning, and every module has to be opened to be judged.
   */
  'path.module.progress': '{done, number} / {total, number}',
  'path.module.done': 'Finished',
  'path.module.share': 'Share this module',
  'path.module.shareA11y': 'Share a link to {title} that works without the app',
  'path.module.shareMessage': '{title} — {url}',

  /**
   * The review queue.
   *
   * Called "review" rather than "practice" because it is not extra practice —
   * it is the course coming back for something it already taught, at the
   * moment you were about to lose it.
   */
  'review.title': 'Review',
  'review.due': '{count, plural, one {# thing to review} other {# things to review}}',
  'review.blurb': 'Questions you are about to forget, from across the course.',
  'review.empty': 'Nothing due today',
  'review.empty.blurb':
    'Finish a lesson and what you got wrong comes back here, spaced out so it sticks.',
  'review.start': 'Start review',
  'review.from': 'From {lesson}',
  'review.done.title': 'Review done',
  'review.done.body':
    '{count, plural, one {# question reviewed} other {# questions reviewed}}. Each one comes back later, and sooner if you struggled.',
  'review.done.close': 'Back to the path',
  'path.streak': '{count, number} day streak',
  'path.lesson.minutes': '{count, number} min',
  'path.lesson.steps': '{count, plural, one {# step} other {# steps}}',
  'path.lesson.best': '{count, number} XP best',
  'path.lesson.open': 'Start lesson: {title}',
  'path.reset': 'Reset progress',
  'path.reset.armed': 'Tap again to erase all progress',
  'path.reset.armedA11y': 'Tap again to confirm resetting progress',

  // ---- a lesson in progress ----------------------------------------------
  'lesson.exit': 'Exit lesson',
  'lesson.check': 'Check',
  'challenge.mc.a11yCorrect': 'correct answer',
  'challenge.mc.a11yWrong': 'your answer, incorrect',
  'lesson.continue': 'Continue',
  'lesson.gotIt': 'Got it',
  'lesson.outOfHearts': 'Out of hearts',
  'lesson.hearts': '{count, number} of {max, plural, one {# heart} other {# hearts}} remaining',
  'lesson.combo': '{count, number} in a row',
  'lesson.video.play': 'Play {title}',
  'lesson.video.minutes': '{count, number} min',
  'lesson.video.watchFirst': 'Watch first',
  'lesson.video.privacy': 'Nothing loads until you press play',
  'lesson.video.hide': 'Hide',
  'lesson.video.show': 'Show',
  'lesson.video.captions': 'Subtitles: {choice}',
  'lesson.video.captions.auto': 'Auto',
  'lesson.video.captions.pt': 'Português',
  'lesson.video.captions.en': 'English',
  'lesson.video.captions.off': 'Off',
  'lesson.video.fullscreen': 'Full screen',
  'lesson.video.exitFullscreen': 'Close full screen',

  // ---- the challenge types -----------------------------------------------
  'challenge.order.dragHint': 'Press and hold a step, then drag to reorder',
  'challenge.order.position': 'Step {number, number} of {total, number}: {label}',
  'challenge.order.moveUp': 'Move up',
  'challenge.order.moveDown': 'Move down',
  'challenge.match.term': 'Term',
  'challenge.match.means': 'Means',
  'challenge.match.hint': 'Tap, then tap a definition to link them',
  'challenge.sim.try': 'Try {value}',
  'challenge.sim.goal': 'Your goal',
  'challenge.taccount.entries': 'Entries to post',
  'challenge.taccount.moved': 'What moved',
  'challenge.taccount.assets': 'assets',
  'challenge.taccount.liabilities': 'liabilities',
  'challenge.taccount.assetsTitle': 'Assets',
  'challenge.taccount.liabilitiesTitle': 'Liabilities',
  'challenge.taccount.balanced': 'Balanced',
  'challenge.taccount.offBy': 'Off by {amount}',
  'challenge.taccount.expands': 'Expands',
  'challenge.taccount.contracts': 'Contracts',
  'challenge.taccount.unchanged': 'Unchanged',
  'challenge.taccount.post': 'Post {amount} to {account} on {entity}’s {side}',
  'challenge.taccount.remove': 'Remove {account} posting',
  'entity.central_bank': 'Central bank',
  'entity.commercial_bank': 'Commercial bank',
  'entity.shadow_bank': 'Shadow bank',
  'entity.fiduciary_core': 'Fiduciary core',

  // ---- grading feedback ---------------------------------------------------
  // Several titles per verdict so a long lesson does not read like a broken
  // record. A translation may supply fewer distinct phrases; the picker only
  // ever reads the keys that exist.
  'grade.correct.1': 'Spot on!',
  'grade.correct.2': 'Exactly right',
  'grade.correct.3': 'Nailed it',
  'grade.correct.4': 'That’s it',
  'grade.incorrect.1': 'Not quite',
  'grade.incorrect.2': 'Close, but no',
  'grade.incorrect.3': 'Let’s look again',
  'grade.match.partial': 'You matched {matched, number} of {total, plural, one {# pair} other {# pairs}}.',
  'grade.order.step': 'Step {number, number} should be “{label}”.',
  'grade.sim.open': '{count, plural, one {# objective} other {# objectives}} still open.',
  'grade.taccount.unbalanced':
    '{entity}’s sheet does not balance — assets and liabilities have to move together.',
  'grade.taccount.unexpected': '{entity} should not have a “{account}” entry in this operation.',
  'grade.taccount.wrongAmount': 'The amount on {entity}’s “{account}” is off.',
  'grade.taccount.missingAsset': '{entity} is still missing a posting on the asset side.',
  'grade.taccount.missingLiability': '{entity} is still missing a posting on the liability side.',

  // ---- finishing ----------------------------------------------------------
  'complete.flawless': 'Flawless run!',
  'complete.title': 'Lesson complete',
  'complete.xpEarned': 'XP earned',
  'complete.bestCombo': 'Best combo',
  'complete.takeaways': 'What you just learned',
  'complete.backToPath': 'Back to path',
  'complete.finish': 'Finish',
  'complete.again': 'Practise again',
  'failed.title': 'Out of hearts',
  'failed.body': 'No shame in it — {lesson} trips up most people the first time.',
  'failed.retry': 'Try again',
  'notFound.title': 'Lesson not found',
  'notFound.body': 'No lesson is registered with the id “{id}”.',

  // ---- updates -------------------------------------------------------------
  'update.ready': 'New lessons are ready.',
  'update.restart': 'Restart',
  'update.restartA11y': 'Restart to load the new lessons',

  // ---- the course index ----------------------------------------------------
  'map.title': 'Play a lesson',
  'map.finished': '{done, number} of {total, number} finished',
  'map.live': '{count, plural, one {# lesson} other {# lessons}} live · more shipping',
  'map.resume': 'Pick up where you left off',
  'path.resume.context': '{level} · {module}',
  'map.best': 'Best {best, number} / {total, number} XP',
  'map.runs': '{count, plural, one {# run} other {# runs}}',
  'level.count': '{count, plural, one {# module} other {# modules}}',
  'level.beginner': 'Beginner',
  'level.beginner.blurb': 'Assumes nothing at all',
  'level.intermediate': 'Intermediate',
  'level.intermediate.blurb': 'Assumes you know what a deposit is',
  'level.advanced': 'Advanced',
  'level.advanced.blurb': 'Assumes the interface and the levers',

  /**
   * What finishing a level lets you do.
   *
   * The `blurb` above says what a level assumes; this says what it is worth.
   * Both are on the header because "Intermediate" tells a learner nothing
   * about whether it is for them, and a prerequisite alone only tells them
   * whether they are allowed in.
   */
  'level.beginner.unlocks':
    'Read your own bank balance for what it is — a promise from a bank — and follow a rate decision in the news without taking anyone’s word for what it means.',
  'level.intermediate.unlocks':
    'Price a mortgage, a loan or a bond for what it actually costs you, read a yield curve, and judge a property purchase with the arithmetic rather than the mood.',
  'level.advanced.unlocks':
    'Read the Fed’s and the ECB’s balance sheets line by line, set a policy rate and defend it against the data you had at the time, and run the institution.',
  'difficulty.intro': 'Intro',
  'difficulty.core': 'Core',
  'difficulty.advanced': 'Advanced',

  // ---- the web player ------------------------------------------------------
  // The website's lesson player shows more scaffolding than the app's: a
  // challenge-type label, a hint beside the action button, and a save status
  // the app has no equivalent of.
  'challenge.kind.multiple_choice': 'Pick the best answer',
  'challenge.kind.concept_match': 'Match each pair',
  'challenge.kind.order_flow': 'Put these in order',
  'challenge.kind.interactive_sim': 'Run the model',
  'challenge.kind.t_account_flow': 'Post the entries',
  'lesson.leave': 'Leave this lesson',
  'lesson.progress': 'Lesson progress',
  'lesson.xpEarnedA11y': '{count, number} XP earned',
  'lesson.permalink': 'this question',
  'lesson.hint.ready': 'Ready when you are.',
  'lesson.hint.answer': 'Answer to continue.',
  'lesson.announceCorrect': 'Correct.',
  'lesson.announceIncorrect': 'Not quite.',
  'failed.webBody':
    'Nothing is lost — hearts exist to make you slow down on the mechanism, not to lock you out. Run {lesson} again and the parts you already had will go quickly.',
  'complete.backToLessons': 'Back to lessons',
  'complete.next': 'Next lesson',
  'complete.noMistakes': 'No mistakes',
  'complete.saving': 'Saving to your account…',
  'complete.saved': 'Saved to {name}’s account.',
  'complete.saveFailed':
    'Could not reach your account — this run is safe on this device and will sync next time.',
  'complete.signedIn': 'Signed in.',
  'complete.savedLocally':
    'Saved on this device. Sign in to keep it across devices and start a streak.',
  'complete.optional': 'Optional. The lessons are free either way.',

  // ---- language ------------------------------------------------------------
  'language.label': 'Language',
  'language.choose': 'Show the course in {name}',
  'language.partial':
    'This language is still being translated. Anything not yet translated appears in English.',
} as const;

/** Every key in the interface. A translation is a full or partial map of these. */
export type UiKey = keyof typeof en;
export type UiDictionary = Partial<Record<UiKey, string>>;
