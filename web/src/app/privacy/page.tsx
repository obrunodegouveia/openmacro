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
 * This documents the product decisions actually implemented in this repo (no
 * analytics, no accounts, on-device progress, waitlist email only). It is not
 * legal advice: have counsel review it before launch, and update it the moment
 * the data flows change.
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
            You can read every page and play every simulation on this site
            without an account, and we do not run analytics, advertising or
            third-party tracking scripts. The only personal data we ask for is
            an email address, and only if you choose to join the launch
            waitlist.
          </p>
        </Article>

        <Article title="What we collect">
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong className="text-ink">Waitlist signups.</strong> The email
              address you type and the role you pick (learner, parent, educator
              or developer). Used to email you at launch and when a new module
              ships. Nothing else.
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
            <li>No names, addresses, phone numbers or payment details.</li>
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
              The app requires no account and no sign-in. Lesson progress,
              streaks and reward points are stored on the device and are never
              uploaded.
            </li>
            <li>
              We do not knowingly collect personal information from children
              under 13. The waitlist form asks that anyone under 13 have a
              parent or guardian sign up instead.
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
              If you believe a child has given us an email address, write to{" "}
              <MailLink /> and we will delete it. No proof of identity is
              required to ask for a deletion.
            </li>
          </ul>
        </Article>

        <Article title="Where the data lives">
          <p>
            The website runs on Google Cloud Run. Waitlist signups are recorded
            in Google Cloud Logging and, where a mailing provider is configured,
            forwarded to it so we can send the launch email. We keep waitlist
            entries until you unsubscribe or ask for deletion, whichever comes
            first.
          </p>
        </Article>

        <Article title="Your choices">
          <ul className="ml-5 list-disc space-y-2">
            <li>Every email we send carries a one-click unsubscribe link.</li>
            <li>
              Email <MailLink /> to see, correct or delete what we hold. We
              answer within 30 days.
            </li>
            <li>
              Delete the app to erase all on-device progress. Nothing survives
              on our side.
            </li>
          </ul>
        </Article>

        <Article title="Changes and questions">
          <p>
            Material changes will be posted here with a new date, and anyone on
            the waitlist gets an email. This notice lives in the same
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
