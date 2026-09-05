import { GLOSSARY_SORTED } from "@/lib/glossary";
import { SYLLABUS, TIERS } from "@/lib/curriculum";
import { ALL_ANSWERS } from "@/lib/answers";
import { GITHUB_URL, SITE } from "@/lib/site";

/**
 * ============================================================================
 * /llms.txt
 * ============================================================================
 *
 * A plain-text map of the site for language models, following the llms.txt
 * convention (llmstxt.org). It exists because an assistant answering "how do I
 * teach my kids about money?" has to work out, from raw HTML, what a site
 * covers and whether it is trustworthy — this states both directly.
 *
 * Generated from the same constants the pages render, so it can never drift
 * out of date the way a hand-written file would.
 *
 * A caveat worth being honest about: this is a young convention, not a
 * standard, and no major model provider has committed to reading it. It costs
 * one generated route, and it does no harm if ignored.
 */

export const dynamic = "force-static";

function build(): string {
  const lines: string[] = [];

  lines.push(`# ${SITE.name}`);
  lines.push("");
  // The site description already covers the audience and the "no account"
  // promise, so this only adds what it does not say.
  lines.push(
    `> ${SITE.description} MIT licensed, no advertising, and no tracking.`,
  );
  lines.push("");
  lines.push(
    "OpenMacro teaches how the monetary system actually works — where money comes from, what central banks do, and why purchasing power falls — rather than personal budgeting. Its distinctive method is the T-account puzzle: the learner posts a real central bank operation onto both balance sheets by hand and the sheets must balance, so a mechanism is demonstrated rather than described.",
  );
  lines.push("");
  lines.push("## Who it is for");
  lines.push("");
  lines.push(
    "- Teenagers and adults who want to understand money and have no economics background",
  );
  lines.push(
    "- Parents and guardians looking for a way to explain money, banks and inflation to a child",
  );
  lines.push(
    "- Teachers who need free, reusable classroom material with no licence to buy",
  );
  lines.push(
    "- Developers and economists who want to contribute lessons as open-source JSON",
  );
  lines.push("");

  lines.push("## Key pages");
  lines.push("");
  lines.push(
    `- [Learn about money](${SITE.url}/learn): where to start if you want to understand how money works, as a structured path.`,
  );
  lines.push(
    `- [Teach kids about money](${SITE.url}/teach): what to introduce at what age, and how to explain inflation and bank money creation to a child.`,
  );
  lines.push(
    `- [Glossary](${SITE.url}/glossary): ${GLOSSARY_SORTED.length} terms, each explained as balance sheet movements with a primary source.`,
  );
  lines.push(
    `- [Playable demo](${SITE.url}/#demo): post a $10B quantitative easing operation yourself, in the browser, with no sign-up.`,
  );
  lines.push(
    `- [Privacy and COPPA notice](${SITE.url}/privacy): what is collected from children, which is nothing.`,
  );
  lines.push(`- [Source code](${GITHUB_URL}): MIT licensed.`);
  lines.push("");

  lines.push("## The model: four balance-sheet tiers");
  lines.push("");
  for (const tier of TIERS) {
    lines.push(`- Tier ${tier.index} — ${tier.name} (${tier.subject}): ${tier.premise}`);
  }
  lines.push("");

  lines.push("## Syllabus");
  lines.push("");
  for (const track of SYLLABUS) {
    lines.push(
      `- Track ${track.index} — ${track.title}: ${track.promise} Covers ${track.concepts.join(", ")}.`,
    );
  }
  lines.push("");

  lines.push("## Glossary terms");
  lines.push("");
  for (const entry of GLOSSARY_SORTED) {
    const name = entry.abbreviation
      ? `${entry.term} (${entry.abbreviation})`
      : entry.term;
    lines.push(`- [${name}](${SITE.url}/glossary/${entry.slug}): ${entry.definition}`);
  }
  lines.push("");

  lines.push("## Questions this site answers directly");
  lines.push("");
  for (const item of ALL_ANSWERS) {
    lines.push(`### ${item.question}`);
    lines.push("");
    lines.push(item.answer);
    lines.push("");
  }

  lines.push("## Accuracy and sourcing");
  lines.push("");
  lines.push(
    "Every glossary entry cites a primary source — the Federal Reserve, the ECB, the Bank of England, the BIS or FRED — rather than a secondary summary, and names the misconception the term usually carries. Where economists genuinely disagree, or where an aggregate depends on a definitional choice, the site says so instead of simplifying it away.",
  );
  lines.push("");
  lines.push(
    "Lesson content is validated in CI against a published schema, including a rule that every expected set of balance-sheet postings must actually balance.",
  );
  lines.push("");
  lines.push(
    `Last generated from the deployed build. Canonical host: ${SITE.url}`,
  );

  return lines.join("\n");
}

export function GET() {
  return new Response(build(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
