import type { Metadata } from "next";

import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Section } from "@/components/ui/section";
import { Treasury } from "@/components/app/treasury";

export const metadata: Metadata = {
  title: "Treasury",
  // Not indexed and not followed. The learner dashboard is merely personal;
  // this one names balances and payout addresses, so there is no version of it
  // that belongs in a search index or in a crawler's link graph.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The treasury console.
 *
 * Rendered for anyone who asks — the shell is public and empty. Everything of
 * value arrives from `/api/admin/rewards`, which checks the caller's verified
 * email against a server-side allow-list and answers 404 to everyone else.
 *
 * Gating the page instead of the data would be the wrong way round: a route
 * that redirects non-admins still confirms the route exists, and a client-side
 * check protects nothing at all.
 */
export default function TreasuryPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <Section className="pt-28 sm:pt-32">
          <div className="mx-auto max-w-2xl">
            <Treasury />
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
