import type { Metadata } from "next";
import { getSiteText } from "@/lib/site-text";
import { LocaleLink } from "@/components/site/locale-link";
import { ArrowLeft } from "lucide-react";
import { SITE, GITHUB_URL } from "@/lib/site";
import { localisedCopy } from "@/lib/seo-copy";
import { alternates, serverLocale } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await serverLocale();
  return {
    title: "Privacy & COPPA notice",
    description:
      "What OpenMacro collects, what it does not, and how children's privacy is handled.",
    ...localisedCopy("/privacy", locale),
    alternates: alternates(locale, "/privacy"),
  };
}

/**
 * Plain-language privacy notice covering the website and the app.
 *
 * This documents the product decisions actually implemented in this repo: no
 * analytics, optional Google sign-in, and progress stored per learner under
 * row-level security. It is not legal advice: have counsel review it before
 * launch, and update it the moment the data flows change.
 */
export default async function PrivacyPage() {
  const s = await getSiteText();
  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8">
      <LocaleLink
        href="/"
        className="inline-flex items-center gap-2 text-sm font-bold text-ink-muted transition-colors hover:text-mint-bright"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {s("privacy.back")}
      </LocaleLink>

      <h1 className="mt-8 font-display text-4xl font-extrabold tracking-tight">
        {s("privacy.title")}
      </h1>
      <p className="mt-3 text-sm text-ink-faint">
        {s("privacy.updated", { domain: SITE.domain })}
      </p>
      {/* A translated notice is a courtesy, not a second legal instrument.
          Saying which version governs is the honest thing to do and costs a
          sentence; the key is empty in English, so nothing renders there. */}
      {s("privacy.authoritative") ? (
        <p className="mt-2 text-sm font-semibold text-ink-muted">
          {s("privacy.authoritative")}
        </p>
      ) : null}

      <div className="mt-10 flex flex-col gap-10">
        <Article title={s("privacy.short.title")}>
          <p>
            {s("privacy.short.body")}
          </p>
        </Article>

        <Article title={s("privacy.collect.title")}>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong className="text-ink">{s("privacy.collect.signin.label")}</strong>{" "}
              {s("privacy.collect.signin.body")}
            </li>
            <li>
              <strong className="text-ink">{s("privacy.collect.progress.label")}</strong>{" "}
              {s("privacy.collect.progress.body")}
            </li>
            <li>
              <strong className="text-ink">{s("privacy.collect.logs.label")}</strong>{" "}
              {s("privacy.collect.logs.body")}
            </li>
            <li>
              <strong className="text-ink">{s("privacy.collect.sim.label")}</strong>{" "}
              {s("privacy.collect.sim.body")}
            </li>
          </ul>
        </Article>

        <Article title={s("privacy.notCollect.title")}>
          <ul className="ml-5 list-disc space-y-2">
            <li>{s("privacy.notCollect.1")}</li>
            <li>{s("privacy.notCollect.2")}</li>
            <li>
              {s("privacy.notCollect.3")}
            </li>
            <li>{s("privacy.notCollect.4")}</li>
          </ul>
        </Article>

        <Article title={s("privacy.coppa.title")}>
          <p>
            {s("privacy.coppa.intro")}
          </p>
          <ul className="ml-5 mt-3 list-disc space-y-2">
            <li>
              {s("privacy.coppa.1")}
            </li>
            <li>
              {s("privacy.coppa.2")}
            </li>
            <li>
              {s("privacy.coppa.3.lead")}{" "}
              <MailLink /> {s("privacy.coppa.3.tail")}
            </li>
            <li>
              {s("privacy.coppa.4")}
            </li>
            <li>
              {s("privacy.coppa.5")}
            </li>
            <li>
              {s("privacy.coppa.6")}
            </li>
            <li>
              {s("privacy.coppa.7")}
            </li>
            <li>
              {s("privacy.coppa.8")}
            </li>
          </ul>
        </Article>

        <Article title={s("privacy.where.title")}>
          <p>
            {s("privacy.where.1")}
          </p>
          <p className="mt-3">
            {s("privacy.where.2")}
          </p>
        </Article>

        <Article title={s("privacy.choices.title")}>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              {s("privacy.choices.1")}
            </li>
            <li>
              {s("privacy.choices.2.lead")} <MailLink /> {s("privacy.choices.2.tail")}
            </li>
            <li>
              {s("privacy.choices.3.lead")}{" "}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noreferrer noopener"
                className="text-mint-bright underline underline-offset-4"
              >
                {s("privacy.choices.3.link")}
              </a>
              .
            </li>
            <li>
              {s("privacy.choices.4")}
            </li>
          </ul>
        </Article>

        <Article title={s("privacy.changes.title")}>
          <p>
            {s("privacy.changes.lead")}{" "}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="text-mint-bright underline underline-offset-4"
            >
              GitHub
            </a>
            {s("privacy.changes.tail")} <MailLink />.
          </p>
        </Article>
      </div>
    </main>
  );
}

function Article({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article>
      <h2 className="font-display text-xl font-extrabold tracking-tight">
        {title}
      </h2>
      <div className="mt-3 text-sm leading-relaxed text-ink-muted">
        {children}
      </div>
    </article>
  );
}

function MailLink() {
  return (
    <a
      href={`mailto:${SITE.privacyEmail}`}
      className="text-mint-bright underline underline-offset-4"
    >
      {SITE.privacyEmail}
    </a>
  );
}
