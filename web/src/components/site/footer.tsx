import { MessageCircle, Scale, ShieldCheck } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import Link from "next/link";
import { AccountPanel } from "@/components/site/account-button";
import { Badge } from "@/components/ui/badge";
import {
  GITHUB_CONTRIBUTING_URL,
  GITHUB_ISSUES_URL,
  GITHUB_URL,
  SITE,
} from "@/lib/site";

const COLUMNS = [
  {
    heading: "Learn",
    links: [
      { label: "Web demo", href: "/#demo" },
      { label: "Learn about money", href: "/learn" },
      { label: "Teach kids about money", href: "/teach" },
      { label: "Syllabus", href: "/#curriculum" },
      { label: "The model", href: "/#tiers" },
      { label: "Glossary", href: "/glossary" },
    ],
  },
  {
    heading: "Build",
    links: [
      { label: "GitHub repository", href: GITHUB_URL, external: true },
      { label: "Contributing guide", href: GITHUB_CONTRIBUTING_URL, external: true },
      { label: "Open issues", href: GITHUB_ISSUES_URL, external: true },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy & COPPA notice", href: "/privacy" },
      { label: "MIT licence", href: `${GITHUB_URL}/blob/main/LICENSE`, external: true },
      { label: SITE.contactEmail, href: `mailto:${SITE.contactEmail}` },
    ],
  },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-hairline bg-abyss/60">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <AccountPanel />

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-ink-faint">
                  {column.heading}
                </h4>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {"external" in link && link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-sm font-semibold text-ink-muted underline-offset-4 transition-colors hover:text-mint-bright hover:underline"
                        >
                          {link.label}
                        </a>
                      ) : link.href.startsWith("mailto:") ? (
                        <a
                          href={link.href}
                          className="text-sm font-semibold text-ink-muted underline-offset-4 transition-colors hover:text-mint-bright hover:underline"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm font-semibold text-ink-muted underline-offset-4 transition-colors hover:text-mint-bright hover:underline"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance strip -------------------------------------------- */}
        <div className="mt-12 grid gap-4 border-t border-hairline pt-8 sm:grid-cols-3">
          <Disclosure
            icon={<Scale className="size-4 text-mint" aria-hidden />}
            title="MIT licensed"
            body="Code and lessons are free to use, fork, translate and teach from — commercially included."
          />
          <Disclosure
            icon={<ShieldCheck className="size-4 text-mint" aria-hidden />}
            title="COPPA-conscious by design"
            body="No account is required to learn, no behavioural ads, and no personal data collected from children under 13."
          />
          <Disclosure
            icon={<ShieldCheck className="size-4 text-mint" aria-hidden />}
            title="Non-custodial rewards"
            body="MacroXP and MintBucks are a learning score, kept on-device unless you sign in to sync it. Prize pools are funded and awarded by their sponsor — we never hold the money."
          />
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-hairline pt-8 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-sm font-extrabold">
              Open<span className="text-mint-bright">Macro</span>
            </p>
            <p className="mt-1 text-xs text-ink-faint">
              © {year} {SITE.name} contributors. Educational content only — nothing
              here is financial advice.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge tone="mint">
              <Scale className="size-3" aria-hidden />
              MIT
            </Badge>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="OpenMacro on GitHub"
              className="rounded-lg border border-hairline p-2 text-ink-muted transition-colors hover:border-mint/40 hover:text-ink"
            >
              <GithubIcon className="size-4" aria-hidden />
            </a>
            <a
              href={SITE.discordUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="OpenMacro community chat"
              className="rounded-lg border border-hairline p-2 text-ink-muted transition-colors hover:border-mint/40 hover:text-ink"
            >
              <MessageCircle className="size-4" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Disclosure({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-white/[0.03] p-4">
      <h5 className="flex items-center gap-2 text-sm font-extrabold">
        {icon}
        {title}
      </h5>
      <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{body}</p>
    </div>
  );
}

/**
 * The footer for a lesson.
 *
 * A learner who has just finished a run needs a licence line and a way back —
 * not an account pitch, a sitemap and three compliance cards. The full
 * <Footer /> is for the pages people arrive on, not the one they work in.
 */
export function FooterMinimal() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-abyss/60">
      <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-6 text-xs text-ink-faint sm:px-8">
        <p>
          <Link
            href="/"
            className="font-display font-extrabold text-ink-muted transition-colors hover:text-ink"
          >
            Open<span className="text-mint-bright">Macro</span>
          </Link>{" "}
          · © {year} contributors. Educational content only — nothing here is
          financial advice.
        </p>
        <nav aria-label="Footer" className="flex items-center gap-4 font-semibold">
          <Link href="/learn" className="transition-colors hover:text-ink">
            All lessons
          </Link>
          <Link href="/glossary" className="transition-colors hover:text-ink">
            Glossary
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-ink">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
