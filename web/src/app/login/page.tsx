import Link from "next/link";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Section } from "@/components/ui/section";
import { AccountPanel } from "@/components/site/account-button";
import { JsonLd, breadcrumbs, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sign in",
  description:
    "Sign in to OpenMacro with Google to save your XP and day streak across devices. Every lesson stays free to play without an account.",
  path: "/login",
  keywords: ["openmacro sign in", "openmacro login", "openmacro account"],
});

/**
 * The account page.
 *
 * Exists mainly so there is a *link*: before this, the only way to sign in was
 * to finish a lesson and find the prompt on the completion screen, which is no
 * use to someone who already has an account and just wants back into it.
 *
 * Deliberately does not gate anything. Nothing on this site requires an
 * account, so this page explains what one is for and gets out of the way.
 */
export default function LoginPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Sign in", path: "/login" },
        ])}
      />
      <Nav />
      <main id="main">
        <Section className="pt-28 sm:pt-32">
          <div className="mx-auto max-w-xl">
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Sign in to OpenMacro
            </h1>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">
              Your account does one thing: it remembers. XP and your day streak
              are saved as you finish lessons, so they survive closing the tab
              and follow you to your phone.
            </p>

            {/* Signing in from here means you want the dashboard. */}
            <AccountPanel className="mt-8" redirectTo="/dashboard" />

            <p className="mt-6 text-sm leading-relaxed text-ink-faint">
              No account? Signing in with Google creates one. You can also just{" "}
              <Link
                href="/learn"
                className="text-ink-muted underline underline-offset-4 hover:text-mint-bright"
              >
                start learning
              </Link>{" "}
              — every lesson is free to play, signed in or not.
            </p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
