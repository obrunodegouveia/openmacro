import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";
import { AuthProvider } from "@/components/site/auth-provider";
import { MotionPreferences } from "@/components/site/motion-preferences";
import { LocaleProvider } from "@/components/site/locale-provider";
import { LOCALE_TAGS } from "@openmacro/core/i18n/locales";
import { alternates, localeUrl, serverLocale } from "@/lib/locale-server";
import { getSiteText } from "@/lib/site-text";
import { localisedCopy } from "@/lib/seo-copy";
import { SmoothAnchors } from "@/components/site/smooth-anchors";
import { ActivityHeartbeat } from "@/components/app/activity-heartbeat";
import { SeasonalDecor } from "@/components/site/seasonal-decor";
import { SEASON_SCRIPT } from "@/lib/season";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-code",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await serverLocale();
  const pt = localisedCopy("/", locale);
  return {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.searchTitle} — ${SITE.name}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "learn about money",
    "how does money work",
    "how is money created",
    "teach kids about money",
    "financial literacy for kids",
    "macroeconomics",
    "monetary policy",
    "central banking",
    "fractional reserve banking",
    "open source education",
  ],
  authors: [{ name: `${SITE.name} contributors`, url: SITE.url }],
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  creator: `${SITE.name} contributors`,
  publisher: SITE.name,
  category: "education",
  // Stops iOS Safari turning figures like "$10B" into tel: links.
  formatDetection: { telephone: false, address: false, email: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Let Google use full-length previews and large image thumbnails
      // instead of the conservative defaults.
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
    ...(pt.title
      ? { title: { default: `${pt.title} — ${SITE.name}`, template: `%s — ${SITE.name}` } }
      : {}),
    ...(pt.description ? { description: pt.description } : {}),
    ...(pt.keywords ? { keywords: pt.keywords } : {}),
    alternates: alternates(locale, "/"),
    openGraph: {
      type: "website",
      url: localeUrl(locale, "/"),
      siteName: SITE.name,
      title: pt.title ? `${SITE.name} — ${pt.title}` : `${SITE.name} — ${SITE.tagline}`,
      description: pt.description ?? SITE.description,
      locale: locale === "pt-PT" ? "pt_PT" : "en_US",
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#070c16" },
    { media: "(prefers-color-scheme: light)", color: "#f4f6fa" },
  ],
  colorScheme: "dark light",
};

/**
 * Signed-in visitors to the home page go to Today.
 *
 * The home page is a static marketing page for search engines and first
 * visits; someone who already learns here opens the site to resume. This runs
 * inline in <body> before anything paints. It only checks that a Supabase
 * session is stored (supabase-js keeps it in localStorage as
 * `sb-<project>-auth-token`); an expired one is refreshed or cleared by the
 * dashboard itself, which shows the signed-out state if needed.
 *
 * Skipped for any link to a section (`/#demo`), and for `?landing`, so the
 * page stays reachable on purpose. Crawlers have no stored session.
 */
const TODAY_REDIRECT = `(function(){try{var p=location.pathname;if((p!=="/"&&p!=="/pt"&&p!=="/pt/")||location.hash||/[?&]landing(=|&|$)/.test(location.search))return;for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&/^sb-.+-auth-token$/.test(k)){location.replace(p.indexOf("/pt")===0?"/pt/dashboard":"/dashboard");return}}}catch(e){}})();`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // From the URL, via middleware. A crawler fetching /pt/learn must receive
  // Portuguese in the HTML itself, not after JavaScript runs.
  const locale = await serverLocale();

  return (
    // suppressHydrationWarning: SEASON_SCRIPT sets `data-season` on <html>
    // before React hydrates it, which is the point, not a mismatch.
    <html
      lang={LOCALE_TAGS[locale]}
      className={`${jakarta.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        {/* Before first paint, so a signed-in learner never sees the
            marketing page flash on the way to Today. See TODAY_REDIRECT. */}
        <script dangerouslySetInnerHTML={{ __html: TODAY_REDIRECT }} />
        {/* Before first paint too, so a seasonal palette never flashes in
            after the ordinary one. See lib/season.ts. */}
        <script dangerouslySetInnerHTML={{ __html: SEASON_SCRIPT }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-mint focus:px-4 focus:py-2 focus:font-bold focus:text-abyss"
        >
          {(await getSiteText())("layout.skip")}
        </a>
        <SmoothAnchors />
        <LocaleProvider initialLocale={locale}>
          {/* Inert when no Supabase project is configured — see lib/supabase.ts. */}
          <AuthProvider>
            <MotionPreferences>{children}</MotionPreferences>
            {/* Silent unless this account is paid for active time. */}
            <ActivityHeartbeat />
          </AuthProvider>
          <SeasonalDecor />
        </LocaleProvider>
      </body>
    </html>
  );
}
