import Link from "next/link";
import { ArrowRight, Baby, ShieldCheck, Users } from "lucide-react";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Section, SectionHeading } from "@/components/ui/section";
import { AnswerList } from "@/components/site/answer-list";
import { Badge } from "@/components/ui/badge";
import { TEACH_ANSWERS, faqPageLd } from "@/lib/answers";
import { JsonLd, ORGANIZATION, breadcrumbs, pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "How to Teach Kids About Money",
  description:
    "What to teach at what age, how to explain inflation and where bank money comes from, plus free lessons kids can play with no account and no tracking.",
  path: "/teach",
  keywords: [
    "teach kids about money",
    "how to explain inflation to a child",
    "money lessons for kids",
    "financial literacy for children",
    "teaching economics to teenagers",
    "classroom economics resources",
  ],
});

/** What to introduce, and roughly when. Ages are guidance, not gates. */
const STAGES = [
  {
    icon: <Baby className="size-5" aria-hidden />,
    age: "Ages 7–9",
    idea: "Money is a promise, not a thing",
    body: "A coin is not valuable because of the metal. It works because everyone accepts it and the state stands behind it. Ask what would happen if a shop stopped accepting it — that question does most of the teaching.",
  },
  {
    icon: <Users className="size-5" aria-hidden />,
    age: "Ages 10–12",
    idea: "Banks write money when they lend",
    body: "Ask where a bank gets the money for a loan. When they answer “from savers”, show them that no saver's balance falls. The number in the borrower's account is new, and it was typed.",
  },
  {
    icon: <Users className="size-5" aria-hidden />,
    age: "Ages 13–16",
    idea: "Someone sets the price of money",
    body: "Interest rates are decided by a committee, and that decision reaches their family's rent or mortgage. Teenagers who have noticed prices rising find this more compelling than budgeting advice.",
  },
  {
    icon: <ShieldCheck className="size-5" aria-hidden />,
    age: "Ages 16+",
    idea: "The whole machine",
    body: "Central bank balance sheets, quantitative easing, the offshore dollar system. At this point they can post the entries themselves and check a claim against a Federal Reserve source.",
  },
];

/**
 * The parent and educator entry point.
 *
 * This page has a specific obligation the others do not: an adult deciding
 * whether to put a child in front of a product needs the privacy answer
 * plainly, not buried in a policy page. It is stated on the page and linked.
 */
export default function TeachPage() {
  return (
    <>
      <JsonLd data={faqPageLd(TEACH_ANSWERS)} />
      <JsonLd
        data={breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Teach kids about money", path: "/teach" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: "Teaching children how money works",
          description:
            "A free guide for parents, guardians and teachers: what to introduce at what age, and how to explain inflation and bank money creation to a child.",
          url: `${SITE.url}/teach`,
          learningResourceType: "Guide",
          audience: {
            "@type": "EducationalAudience",
            educationalRole: ["parent", "teacher"],
          },
          isAccessibleForFree: true,
          inLanguage: "en",
          provider: ORGANIZATION,
        }}
      />

      <Nav />
      <main id="main" className="pt-16">
        <Section>
          <SectionHeading
            align="left"
            overline="For parents & educators"
            title={
              <>
                How to teach kids what money{" "}
                <span className="text-gradient">really is</span>.
              </>
            }
            lede="Pocket money teaches discipline. It does not explain why prices rise or where a bank loan comes from — and children ask those questions long before they earn anything. This is what to teach, roughly when, and how to say it."
          />

          <div className="mt-10 flex flex-wrap gap-3">
            <Badge tone="mint">Free, no licence to buy</Badge>
            <Badge tone="neutral">No child accounts</Badge>
            <Badge tone="gold">No ads, no tracking</Badge>
          </div>

          {/* Stages ----------------------------------------------------- */}
          <section className="mt-14" aria-labelledby="stages">
            <h2
              id="stages"
              className="font-display text-2xl font-extrabold tracking-tight"
            >
              What to introduce, and when
            </h2>
            <p className="mt-2 max-w-2xl leading-relaxed text-ink-muted">
              Ages are guidance, not gates. A curious nine-year-old who asks
              where money comes from is ready for the answer.
            </p>

            <ol className="mt-6 grid gap-4 sm:grid-cols-2">
              {STAGES.map((stage) => (
                <li
                  key={stage.age}
                  className="rounded-card border border-hairline bg-white/[0.02] p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl border border-mint/30 bg-mint/10 text-mint-bright">
                      {stage.icon}
                    </span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-mint-bright">
                      {stage.age}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-extrabold">
                    {stage.idea}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {stage.body}
                  </p>
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
              Questions parents and teachers ask
            </h2>
            <div className="mt-6">
              <AnswerList answers={TEACH_ANSWERS} />
            </div>
          </section>

          {/* Safety ----------------------------------------------------- */}
          <section
            className="mt-14 rounded-card border border-mint/25 bg-mint/[0.06] p-7"
            aria-labelledby="safety"
          >
            <h2
              id="safety"
              className="flex items-center gap-2 font-display text-xl font-extrabold"
            >
              <ShieldCheck className="size-5 text-mint-bright" aria-hidden />
              What we collect from your child: nothing
            </h2>
            <ul className="mt-3 flex max-w-2xl list-disc flex-col gap-2 pl-5 leading-relaxed text-ink-muted">
              <li>No account or sign-in is required to learn.</li>
              <li>No analytics, advertising or third-party tracking scripts.</li>
              <li>
                Progress, streaks and reward points stay on the device and are
                never uploaded.
              </li>
              <li>
                Reward points are a learning score — not money, not a wallet,
                with no way to buy or cash them out.
              </li>
              <li>
                The only personal data collected anywhere is an email address,
                and only if an adult joins the launch waitlist.
              </li>
            </ul>
            <Link
              href="/privacy"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-mint-bright underline-offset-4 hover:underline"
            >
              Read the full privacy and COPPA notice
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </section>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/#demo"
              className="inline-flex h-12 items-center justify-center rounded-xl border-b-4 border-mint-deep bg-mint px-6 font-extrabold text-abyss transition-all hover:bg-mint-bright active:translate-y-[3px] active:border-b-0"
            >
              Try a lesson yourself first
            </Link>
            <Link
              href="/learn"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-hairline bg-white/5 px-6 font-extrabold text-ink transition-colors hover:border-mint/60 hover:bg-white/10"
            >
              Learn it yourself
            </Link>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
