import { MessageCircle, Scale, ShieldCheck } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { LocaleLink } from "@/components/site/locale-link";
import { getSiteText } from "@/lib/site-text";
import { AccountPanel } from "@/components/site/account-button";
import { Badge } from "@/components/ui/badge";
import { LanguagePicker } from "@/components/site/language-picker";
import {
  GITHUB_CONTRIBUTING_URL,
  GITHUB_ISSUES_URL,
  GITHUB_URL,
  SITE,
} from "@/lib/site";

const COLUMNS = [
  {
    heading: "footer.group.learn",
    links: [
      { label: "footer.link.demo", href: "/#demo" },
      { label: "footer.link.learn", href: "/learn" },
      { label: "footer.link.teach", href: "/teach" },
      { label: "footer.link.syllabus", href: "/#curriculum" },
      { label: "footer.link.model", href: "/#tiers" },
      { label: "footer.link.glossary", href: "/glossary" },
    ],
  },
  {
    heading: "footer.group.build",
    links: [
      { label: "footer.link.repo", href: GITHUB_URL, external: true },
      { label: "footer.link.contributing", href: GITHUB_CONTRIBUTING_URL, external: true },
      { label: "footer.link.issues", href: GITHUB_ISSUES_URL, external: true },
    ],
  },
  {
    heading: "footer.group.legal",
    links: [
      { label: "footer.link.privacy", href: "/privacy" },
      { label: "footer.link.licence", href: `${GITHUB_URL}/blob/main/LICENSE`, external: true },
      { literal: SITE.contactEmail, href: `mailto:${SITE.contactEmail}` },
    ],
  },
] as const;

export async function Footer() {
  const s = await getSiteText();
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
                  {s(column.heading)}
                </h4>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      {"external" in link && link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-sm font-semibold text-ink-muted underline-offset-4 transition-colors hover:text-mint-bright hover:underline"
                        >
                          {s(link.label)}
                        </a>
                      ) : "literal" in link ? (
                        <a
                          href={link.href}
                          className="text-sm font-semibold text-ink-muted underline-offset-4 transition-colors hover:text-mint-bright hover:underline"
                        >
                          {link.literal}
                        </a>
                      ) : (
                        <LocaleLink
                          href={link.href}
                          className="text-sm font-semibold text-ink-muted underline-offset-4 transition-colors hover:text-mint-bright hover:underline"
                        >
                          {s(link.label)}
                        </LocaleLink>
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
            title={s("footer.mitLicensed")}
            body={s("footer.mitBody")}
          />
          <Disclosure
            icon={<ShieldCheck className="size-4 text-mint" aria-hidden />}
            title={s("footer.coppa")}
            body={s("footer.coppaBody")}
          />
          <Disclosure
            icon={<ShieldCheck className="size-4 text-mint" aria-hidden />}
            title={s("footer.rewards")}
            body={s("footer.rewardsBody")}
          />
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-hairline pt-8 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-sm font-extrabold">
              Open<span className="text-mint-bright">Macro</span>
            </p>
            <p className="mt-1 text-xs text-ink-faint">
              © {year} {SITE.name} {s("footer.contributors")}{" "}
              {s("footer.disclaimer")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <LanguagePicker />
            <Badge tone="mint">
              <Scale className="size-3" aria-hidden />
              {s("footer.mit")}
            </Badge>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={s("footer.githubA11y")}
              className="rounded-lg border border-hairline p-2 text-ink-muted transition-colors hover:border-mint/40 hover:text-ink"
            >
              <GithubIcon className="size-4" aria-hidden />
            </a>
            <a
              href={SITE.discordUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={s("footer.chatA11y")}
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
export async function FooterMinimal() {
  const s = await getSiteText();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-abyss/60">
      <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-6 text-xs text-ink-faint sm:px-8">
        <p>
          <LocaleLink
            href="/"
            className="font-display font-extrabold text-ink-muted transition-colors hover:text-ink"
          >
            Open<span className="text-mint-bright">Macro</span>
          </LocaleLink>{" "}
          · © {year} {s("footer.contributors")} {s("footer.disclaimer")}
        </p>
        <nav aria-label={s("footer.aria")} className="flex items-center gap-4 font-semibold">
          <LocaleLink href="/learn" className="transition-colors hover:text-ink">
            {s("footer.allLessons")}
          </LocaleLink>
          <LocaleLink href="/glossary" className="transition-colors hover:text-ink">
            {s("footer.glossary")}
          </LocaleLink>
          <LocaleLink href="/privacy" className="transition-colors hover:text-ink">
            {s("footer.privacy")}
          </LocaleLink>
        </nav>
      </div>
    </footer>
  );
}
