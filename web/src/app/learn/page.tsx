import Link from "next/link";
import { ArrowRight, BookOpen, Coins, GraduationCap } from "lucide-react";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Section, SectionHeading } from "@/components/ui/section";
import { AnswerList } from "@/components/site/answer-list";
import { Badge } from "@/components/ui/badge";
import { LEARN_ANSWERS, faqPageLd } from "@/lib/answers";
import { SYLLABUS } from "@/lib/curriculum";
import { JsonLd, ORGANIZATION, breadcrumbs, pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "How to Learn About Money",
  description:
    "Where to start if you want to understand how money really works: who creates it, what central banks do, why prices rise. Free, open source, no account.",
  path: "/learn",
  keywords: [
    "learn about money",
    "how does money work",
    "learn macroeconomics",
    "how is money created",
    "free economics course",
    "understand central banking",
  ],
});

/**
 * The self-learner entry point.
 *
 * Deliberately answers the question in the first paragraph rather than selling
 * first and explaining later: someone who arrives here from "how does money
 * work" should get the answer whether or not they ever click anything.
 */
export default function LearnPage() {
  return (
    <>
      <JsonLd data={faqPageLd(LEARN_ANSWERS)} />
      <JsonLd
        data={breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Learn about money", path: "/learn" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: "How money works — a free learning path",
          description:
            "A structured, free path through how money is created, what central banks do, and why purchasing power falls.",
          url: `${SITE.url}/learn`,
          learningResourceType: "Course",
          educationalLevel: "Beginner to intermediate",
          isAccessibleForFree: true,
          inLanguage: "en",
          provider: ORGANIZATION,
          teaches: SYLLABUS.flatMap((track) => track.concepts),
        }}
      />

      <Nav />
      <main id="main" className="pt-16">
        <Section>
          <SectionHeading
            align="left"
            overline="Start here"
            title={
              <>
                How to learn what money{" "}
                <span className="text-gradient">actually is</span>.
              </>
            }
            lede="Most money is not printed by a government. It is created by commercial banks when they lend, and by central banks when they buy assets. Everything else follows from that, and this is the shortest honest path to understanding it."
          />

          <div className="mt-10 flex flex-wrap gap-3">
            <Badge tone="mint">Free forever</Badge>
            <Badge tone="neutral">No account needed</Badge>
            <Badge tone="gold">MIT licensed</Badge>
          </div>

          {/* The path -------------------------------------------------- */}
          <section className="mt-14" aria-labelledby="path">
            <h2
              id="path"
              className="font-display text-2xl font-extrabold tracking-tight"
            >
              The path, in order
            </h2>
            <ol className="mt-6 flex flex-col gap-4">
              {[
                {
                  icon: <Coins className="size-5" aria-hidden />,
                  title: "Play one real operation, before reading anything",
                  body: "The demo gives you a $10B central bank purchase and asks you to post the entries on both balance sheets. Ten minutes here makes every article about the Fed readable.",
                  href: "/#demo",
                  cta: "Open the demo",
                },
                {
                  icon: <BookOpen className="size-5" aria-hidden />,
                  title: "Learn the vocabulary as mechanisms, not definitions",
                  body: "Reserves, repo, the monetary base, quantitative easing. Each glossary entry explains what moves on whose balance sheet, names the usual misconception, and links the primary source.",
                  href: "/glossary",
                  cta: "Read the glossary",
                },
                {
                  icon: <GraduationCap className="size-5" aria-hidden />,
                  title: "Work through the four tracks in order",
                  body: "From what makes an unbacked token acceptable, through commercial banking and the Fed and ECB levers, to how a dollar crisis is contained. Each track builds the mechanism the next one needs.",
                  href: "/#curriculum",
                  cta: "See the syllabus",
                },
              ].map((step, index) => (
                <li
                  key={step.title}
                  className="flex flex-col gap-3 rounded-card border border-hairline bg-white/[0.02] p-6 sm:flex-row sm:gap-5"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-mint/30 bg-mint/10 text-mint-bright">
                    {step.icon}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-extrabold">
                      <span className="text-ink-faint">{index + 1}. </span>
                      {step.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-ink-muted">
                      {step.body}
                    </p>
                    <Link
                      href={step.href}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-mint-bright underline-offset-4 hover:underline"
                    >
                      {step.cta}
                      <ArrowRight className="size-3.5" aria-hidden />
                    </Link>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Questions -------------------------------------------------- */}
          <section className="mt-16" aria-labelledby="questions">
            <h2
              id="questions"
              className="font-display text-2xl font-extrabold tracking-tight"
            >
              Common questions
            </h2>
            <div className="mt-6">
              <AnswerList answers={LEARN_ANSWERS} />
            </div>
          </section>

          <div className="mt-14 rounded-card border border-mint/25 bg-mint/[0.06] p-7">
            <h2 className="font-display text-xl font-extrabold">
              Teaching someone else?
            </h2>
            <p className="mt-2 max-w-2xl leading-relaxed text-ink-muted">
              There is a separate guide for parents, guardians and teachers,
              covering what to introduce at what age and how to explain
              inflation and bank money to a child.
            </p>
            <Link
              href="/teach"
              className="mt-4 inline-flex h-11 items-center justify-center rounded-xl border-b-4 border-mint-deep bg-mint px-5 font-extrabold text-abyss transition-all hover:bg-mint-bright active:translate-y-[3px] active:border-b-0"
            >
              How to teach kids about money
            </Link>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
