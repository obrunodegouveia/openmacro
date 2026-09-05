import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SITE, GITHUB_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy & COPPA notice",
  description:
    "What OpenMacro collects, what it does not, and how children's privacy is handled.",
  alternates: { canonical: `${SITE.url}/privacy` },
};

/**
 * Plain-language privacy notice covering the website and the app.
 *
 * This documents the product decisions actually implemented in this repo: no
 * analytics, optional Google sign-in, and progress stored per learner under
 * row-level security. It is not legal advice: have counsel review it before
 * launch, and update it the moment the data flows change.
 */
export default function PrivacyPage() {
  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-bold text-ink-muted transition-colors hover:text-mint-bright"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to openmacro.org
      </Link>

      <h1 className="mt-8 font-display text-4xl font-extrabold tracking-tight">
        Privacy & children&apos;s privacy notice
      </h1>
      <p className="mt-3 text-sm text-ink-faint">
        Last updated 5 September 2026. Covers {SITE.domain} and the OpenMacro
        mobile app.
      </p>

      <div className="mt-10 flex flex-col gap-10">
        <Article title="The short version">
          <p>
            You can read every page, play every simulation and finish every
            lesson on this site without an account, and we do not run
            analytics, advertising or third-party tracking scripts. If you
            choose to sign in with Google, we save your XP and day streak so
            they follow you between devices — that is the only reason an
            account exists, and the only personal data we hold.
          </p>
        </Article>

        <Article title="What we collect">
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong className="text-ink">If you sign in with Google.</strong>{" "}
              Google sends us your name, email address, profile picture and your
              Google account identifier. We store your name against your
              progress, and the email address is held by our authentication
              provider so you can sign back in.
            </li>
            <li>
              <strong className="text-ink">Your progress, once signed in.</strong>{" "}
              Total XP, your day streak, the date of your last completed lesson,
              and for each lesson your best score, how many times you have
              finished it and when. No answers, no timings, nothing about how
              you played.
            </li>
            <li>
              <strong className="text-ink">Server logs.</strong> Our host
              records standard request logs — IP address, timestamp, requested
              path, user agent — to keep the service running and to block
              abuse. These are retained for 30 days and then deleted.
            </li>
            <li>
              <strong className="text-ink">Nothing from the simulator.</strong>{" "}
              The slider, the readouts and the lending chain all run in your
              browser. Your inputs are never sent to us.
            </li>
          </ul>
        </Article>

        <Article title="What we do not collect">
          <ul className="ml-5 list-disc space-y-2">
            <li>No cookies for advertising, profiling or cross-site tracking.</li>
            <li>No analytics or session-recording services.</li>
            <li>
              No addresses, phone numbers or payment details. We never ask for a
              password: Google handles sign-in, so there is none for us to hold.
            </li>
            <li>No selling, renting or trading of any data, ever.</li>
          </ul>
        </Article>

        <Article title="Children under 13 (COPPA)">
          <p>
            OpenMacro is written for young adults and kids, so we treat
            children&apos;s privacy as a design constraint rather than a policy
            page.
          </p>
          <ul className="ml-5 mt-3 list-disc space-y-2">
            <li>
              No account is needed to learn. Every lesson, on the site and in
              the app, plays in full without signing in, and while you are
              signed out progress stays on the device and is never uploaded.
            </li>
            <li>
              Signing in is optional and requires a Google Account, which Google
              does not issue to children under 13 — and under 16 in some
              countries. A child using a Family Link account signs in only with
              their parent&apos;s approval.
            </li>
            <li>
              We do not knowingly collect personal information from children
              under 13. If you believe a child has signed in, write to{" "}
              <MailLink /> and we will delete the account and everything
              attached to it.
            </li>
            <li>
              MacroXP and MintBucks are a learning score. They are not
              currency, not a wallet, and cannot be exchanged, transferred or
              cashed out. There is no purchase path anywhere in the product.
            </li>
            <li>
              Skill credentials are issued only when a learner asks for one,
              and for anyone under 13 only with a parent or guardian. We do not
              publish a child&apos;s attainment, name or identifier to any
              public ledger or third-party registry.
            </li>
            <li>
              Prize pools are created, funded and awarded by the sponsor — a
              parent, a school or a community group. OpenMacro never takes
              custody of the money and never handles a payout. Entry is always
              free, and nothing in the product is a wager.
            </li>
            <li>
              There is no advertising, no in-app purchasing, and no chat or
              other child-to-stranger communication anywhere in the product.
            </li>
            <li>
              No proof of identity is required to ask for a deletion, and we
              never ask a child to prove anything before honouring one.
            </li>
          </ul>
        </Article>

        <Article title="Where the data lives">
          <p>
            The website runs on Google Cloud Run. Accounts and progress are
            stored with Supabase, in their West EU (Ireland) region — learner
            data does not leave the EU. Sign-in itself is handled by Google.
          </p>
          <p className="mt-3">
            Every row is protected by database row-level security keyed to your
            account, so one learner cannot read another&apos;s progress, and the
            key shipped in the website can only ever reach your own rows. We
            keep your progress until you ask us to delete it.
          </p>
        </Article>

        <Article title="Your choices">
          <ul className="ml-5 list-disc space-y-2">
            <li>
              Sign out at any time. You can keep using every lesson signed out.
            </li>
            <li>
              Email <MailLink /> to see, correct or delete what we hold,
              including your whole account. We answer within 30 days.
            </li>
            <li>
              You can also revoke OpenMacro&apos;s access from your{" "}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noreferrer noopener"
                className="text-mint-bright underline underline-offset-4"
              >
                Google account permissions
              </a>
              .
            </li>
            <li>
              Delete the app to erase on-device progress. If you never signed
              in, nothing survives on our side.
            </li>
          </ul>
        </Article>

        <Article title="Changes and questions">
          <p>
            Material changes will be posted here with a new date. This notice
            lives in the same
            open-source repository as the site, so its full history is public —
            read it on{" "}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="text-mint-bright underline underline-offset-4"
            >
              GitHub
            </a>
            . Questions go to <MailLink />.
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
