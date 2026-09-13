import { LocaleLink } from "@/components/site/locale-link";
import type { SiteKey } from "@openmacro/core/i18n/site";
import { ArrowRight, Baby, ShieldCheck, Users } from "lucide-react";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Section, SectionHeading } from "@/components/ui/section";
import { AnswerList } from "@/components/site/answer-list";
import { Badge } from "@/components/ui/badge";
import { TEACH_ANSWERS, faqPageLd } from "@/lib/answers";
import { localisedAnswers } from "@/lib/answers-locale";
import { JsonLd, ORGANIZATION, breadcrumbs, pageMetadata } from "@/lib/seo";
import { localisedCopy } from "@/lib/seo-copy";
import { serverLocale } from "@/lib/locale-server";
import { getSiteText } from "@/lib/site-text";
import { SITE } from "@/lib/site";

export async function generateMetadata() {
  const locale = await serverLocale();
  return pageMetadata({
    locale,
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
    ...localisedCopy("/teach", locale),
  });
}

/** What to introduce, and roughly when. Ages are guidance, not gates. */
const STAGES: { icon: React.ReactNode; age: SiteKey; idea: SiteKey; body: SiteKey }[] = [
  {
    icon: <Baby className="size-5" aria-hidden />,
    age: "teach.stage.1.age",
    idea: "teach.stage.1.idea",
    body: "teach.stage.1.body",
  },
  {
    icon: <Users className="size-5" aria-hidden />,
    age: "teach.stage.2.age",
    idea: "teach.stage.2.idea",
    body: "teach.stage.2.body",
  },
  {
    icon: <Users className="size-5" aria-hidden />,
    age: "teach.stage.3.age",
    idea: "teach.stage.3.idea",
    body: "teach.stage.3.body",
  },
  {
    icon: <ShieldCheck className="size-5" aria-hidden />,
    age: "teach.stage.4.age",
    idea: "teach.stage.4.idea",
    body: "teach.stage.4.body",
  },
];

/**
 * The parent and educator entry point.
 *
 * This page has a specific obligation the others do not: an adult deciding
 * whether to put a child in front of a product needs the privacy answer
 * plainly, not buried in a policy page. It is stated on the page and linked.
 */
export default async function TeachPage() {
  const s = await getSiteText();
  const answers = localisedAnswers(await serverLocale(), TEACH_ANSWERS);
  return (
    <>
      <JsonLd data={faqPageLd(answers)} />
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
      <main id="main" className="pt-[var(--header-total)]">
        <Section>
          <SectionHeading
            align="left"
            overline={s("teach.overline")}
            title={
              <>
                {s("teach.title.lead")}{" "}
                <span className="text-gradient">{s("teach.title.emphasis")}</span>.
              </>
            }
            lede={s("teach.lede")}
          />

          <div className="mt-10 flex flex-wrap gap-3">
            <Badge tone="mint">{s("teach.badge.free")}</Badge>
            <Badge tone="neutral">{s("teach.badge.noAccounts")}</Badge>
            <Badge tone="gold">{s("teach.badge.noAds")}</Badge>
          </div>

          {/* Stages ----------------------------------------------------- */}
          <section className="mt-14" aria-labelledby="stages">
            <h2
              id="stages"
              className="font-display text-2xl font-extrabold tracking-tight"
            >
              {s("teach.stagesTitle")}
            </h2>
            <p className="mt-2 max-w-2xl leading-relaxed text-ink-muted">
              {s("teach.stagesLede")}
            </p>

            <ol className="mt-6 grid gap-4 sm:grid-cols-2">
              {STAGES.map((stage) => (
                <li
                  key={s(stage.age)}
                  className="rounded-card border border-hairline bg-white/[0.02] p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl border border-mint/30 bg-mint/10 text-mint-bright">
                      {stage.icon}
                    </span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-mint-bright">
                      {s(stage.age)}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-extrabold">
                    {s(stage.idea)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {s(stage.body)}
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
              {s("teach.questionsTitle")}
            </h2>
            <div className="mt-6">
              <AnswerList answers={answers} />
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
              {s("teach.safetyTitle")}
            </h2>
            <ul className="mt-3 flex max-w-2xl list-disc flex-col gap-2 pl-5 leading-relaxed text-ink-muted">
              <li>
                {s("teach.safety.1")}
              </li>
              <li>{s("teach.safety.2")}</li>
              <li>
                {s("teach.safety.3")}
              </li>
              <li>
                {s("teach.safety.4")}
              </li>
              <li>
                {s("teach.safety.5")}
              </li>
            </ul>
            <LocaleLink
              href="/privacy"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-mint-bright underline-offset-4 hover:underline"
            >
              {s("teach.readPrivacy")}
              <ArrowRight className="size-3.5" aria-hidden />
            </LocaleLink>
          </section>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <LocaleLink
              href="/#demo"
              className="inline-flex h-12 items-center justify-center rounded-xl border-b-4 border-mint-deep bg-mint px-6 font-extrabold text-abyss transition-all hover:bg-mint-bright active:translate-y-[3px] active:border-b-0"
            >
              {s("teach.tryLesson")}
            </LocaleLink>
            <LocaleLink
              href="/learn"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-hairline bg-white/5 px-6 font-extrabold text-ink transition-colors hover:border-mint/60 hover:bg-white/10"
            >
              {s("teach.learnYourself")}
            </LocaleLink>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
