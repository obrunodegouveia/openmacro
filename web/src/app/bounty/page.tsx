import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { BountyAdminNotice } from "@/components/app/bounty-admin-notice";
import { BountyStatus } from "@/components/site/bounty-status";
import { Footer } from "@/components/site/footer";
import { LocaleLink } from "@/components/site/locale-link";
import { Nav } from "@/components/site/nav";
import { BOUNTY, bountyCopy } from "@/lib/bounty";
import { serverLocale } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const c = bountyCopy(await serverLocale());
  return { title: c.title, description: c.lead };
}

/**
 * The bounty announced at the talk in San Salvador on 11 November 2026.
 *
 * The rules are public. The status panel under them is the signed-in
 * learner's own progress, and where the winner leaves the address the prize
 * is paid to. docs/bounty-exam.md is the organiser's side.
 */
export default async function BountyPage() {
  const c = bountyCopy(await serverLocale());
  return (
    <>
      <Nav />
      <main id="main" className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8">
        <BountyAdminNotice showPaid />
        <h1 className="font-display text-4xl font-extrabold tracking-tight">{c.title}</h1>
        <p className="mt-4 text-lg text-ink-muted">{c.lead}</p>

        <h2 className="mt-12 font-display text-2xl font-extrabold">{c.rulesTitle}</h2>
        <ol className="mt-4 ml-5 list-decimal space-y-3 text-ink-muted">
          {c.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ol>
        <LocaleLink
          href={`/learn/${BOUNTY.lessons[0]}`}
          className="mt-6 inline-flex items-center gap-2 font-bold text-mint-bright"
        >
          {c.studyLink}
          <ArrowRight className="size-4" aria-hidden />
        </LocaleLink>

        <h2 className="mt-12 font-display text-2xl font-extrabold">{c.statusTitle}</h2>
        <div className="mt-4">
          <BountyStatus />
        </div>

        <h2 className="mt-12 font-display text-2xl font-extrabold">{c.fairTitle}</h2>
        <p className="mt-4 text-ink-muted">{c.fair}</p>
      </main>
      <Footer />
    </>
  );
}
