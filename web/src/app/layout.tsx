import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";
import { AuthProvider } from "@/components/site/auth-provider";
import { LocaleProvider } from "@/components/site/locale-provider";
import { LOCALE_TAGS } from "@openmacro/core/i18n/locales";
import { alternates, localeUrl, serverLocale } from "@/lib/locale-server";
import { getSiteText } from "@/lib/site-text";
import { localisedCopy } from "@/lib/seo-copy";
import { SmoothAnchors } from "@/components/site/smooth-anchors";

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
  themeColor: "#070c16",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // From the URL, via middleware. A crawler fetching /pt/learn must receive
  // Portuguese in the HTML itself, not after JavaScript runs.
  const locale = await serverLocale();

  return (
    <html lang={LOCALE_TAGS[locale]} className={`${jakarta.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-mint focus:px-4 focus:py-2 focus:font-bold focus:text-abyss"
        >
          {(await getSiteText())("layout.skip")}
        </a>
        <SmoothAnchors />
        <LocaleProvider initialLocale={locale}>
          {/* Inert when no Supabase project is configured — see lib/supabase.ts. */}
          <AuthProvider>{children}</AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
