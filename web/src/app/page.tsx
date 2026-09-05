import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Demo } from "@/components/site/demo";
import { Tiers } from "@/components/site/tiers";
import { Features } from "@/components/site/features";
import { Roadmap } from "@/components/site/roadmap";
import { Rewards } from "@/components/site/rewards";
import { ContributorHub } from "@/components/site/contributor-hub";
import { Footer } from "@/components/site/footer";
import { SITE, GITHUB_URL } from "@/lib/site";
import { SYLLABUS } from "@/lib/curriculum";
import { JsonLd, ORGANIZATION } from "@/lib/seo";

/**
 * Structured data.
 *
 * Three payloads, each doing a distinct job:
 *
 *   - `SoftwareApplication` says this is a free, open-source educational app
 *     rather than a paid course, which is what stops it being read as a
 *     commercial listing.
 *   - `ItemList` of `Course` describes the syllabus. Google renders course
 *     lists as a rich result, and each entry needs a provider and an offer to
 *     qualify.
 *   - `WebSite` ties the pages together under one name for sitelinks.
 *
 * Everything here is derived from the same `SYLLABUS` constant the page
 * renders, so the markup cannot drift away from what a visitor actually sees —
 * which is both a correctness property and a spam-policy requirement.
 */
const softwareLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE.url}#app`,
  name: SITE.name,
  applicationCategory: "EducationalApplication",
  operatingSystem: "iOS, Android, Web",
  description: SITE.description,
  url: SITE.url,
  license: "https://opensource.org/licenses/MIT",
  isAccessibleForFree: true,
  codeRepository: GITHUB_URL,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: ORGANIZATION,
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "student",
  },
  teaches: [
    "Central bank balance sheets",
    "Monetary policy operations",
    "Fractional-reserve banking",
    "Money markets and the repo system",
    "Fiduciary currency and legal tender",
  ],
};

const syllabusLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE.url}#syllabus`,
  name: "The Monetary Machine syllabus",
  itemListElement: SYLLABUS.map((track, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Course",
      name: track.title,
      description: track.promise,
      url: `${SITE.url}/#curriculum`,
      provider: ORGANIZATION,
      isAccessibleForFree: true,
      inLanguage: "en",
      teaches: track.concepts,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        category: "Free",
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: `PT${track.lessonCount * 5}M`,
      },
    },
  })),
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}#website`,
  name: SITE.name,
  alternateName: "OpenMacro — Understand the Machine Behind Money",
  url: SITE.url,
  description: SITE.description,
  inLanguage: "en",
  publisher: ORGANIZATION,
};

export default function Home() {
  return (
    <>
      <JsonLd data={softwareLd} />
      <JsonLd data={syllabusLd} />
      <JsonLd data={websiteLd} />
      <Nav />
      <main id="main">
        <Hero />
        <Demo />
        <Tiers />
        <Features />
        <Roadmap />
        <Rewards />
        <ContributorHub />
      </main>
      <Footer />
    </>
  );
}
