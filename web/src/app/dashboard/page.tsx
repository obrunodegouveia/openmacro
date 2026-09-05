import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Section } from "@/components/ui/section";
import { Dashboard } from "@/components/app/dashboard";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Your progress",
    description:
      "Your XP, day streak and where you left off in the OpenMacro course.",
    path: "/dashboard",
  }),
  // Personal to the signed-in learner, and empty to anyone else — there is
  // nothing here worth indexing, and a crawler would only ever see the
  // signed-out state.
  robots: { index: false, follow: true },
};

/**
 * Where signing in leads.
 *
 * The page shell is static and the content is client-rendered, because the
 * data is per-learner and read through the browser Supabase client under
 * row-level security. Nothing personal is prerendered or cached at the edge.
 */
export default function DashboardPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <Section className="pt-28 sm:pt-32">
          <div className="mx-auto max-w-3xl">
            <Dashboard />
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
