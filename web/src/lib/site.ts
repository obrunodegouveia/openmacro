/** Single source of truth for outbound links and copy used in several places. */
export const SITE = {
  name: "OpenMacro",
  domain: "openmacro.org",
  url: "https://openmacro.org",
  /** Brand line. Used in the hero and on social cards. */
  tagline: "Understand the Machine Behind Money.",
  /**
   * Search-facing title. Front-loads what someone is actually looking for
   * ("learn how money works") ahead of the brand, because a person searching
   * in plain language has never heard of us.
   */
  searchTitle: "Learn How Money Actually Works",
  /**
   * Meta description, kept under ~160 characters so Google does not truncate
   * it, and naming both audiences: the self-learner and the parent.
   */
  description:
    "Free, open-source lessons on how money is created, what central banks do, and why prices rise. For learners, parents and teachers. No account needed.",
  /** Override at build time with NEXT_PUBLIC_GITHUB_REPO if the org moves. */
  githubRepo: process.env.NEXT_PUBLIC_GITHUB_REPO ?? "openmacro/openmacro",
  discordUrl: process.env.NEXT_PUBLIC_DISCORD_URL ?? "https://discord.gg/openmacro",
  license: "MIT",
  contactEmail: "hello@openmacro.org",
  privacyEmail: "privacy@openmacro.org",
} as const;

export const GITHUB_URL = `https://github.com/${SITE.githubRepo}`;
export const GITHUB_ISSUES_URL = `${GITHUB_URL}/issues`;
export const GITHUB_LESSONS_URL = `${GITHUB_URL}/tree/main/src/content/lessons`;
export const GITHUB_CONTRIBUTING_URL = `${GITHUB_URL}/blob/main/CONTRIBUTING.md`;
