"use client";

/**
 * ============================================================================
 * An internal link that stays in the reader's language
 * ============================================================================
 *
 * Every page rendered in Portuguese but every link on it pointing at the
 * English URL. A reader landed on `/pt`, read Portuguese, clicked "Aprender"
 * and arrived at `/learn` in English — and because the locale also lives in
 * `localStorage`, it usually looked like the translation had half-loaded
 * rather than like a navigation had dropped it.
 *
 * The prefix cannot be left to each call site. There are forty internal links
 * across the site and the next one written will be `href="/learn"` by habit,
 * silently correct in English and silently wrong in Portuguese. So the
 * knowledge lives here, once, and `localePath` passes through anything that is
 * not an internal path — an absolute URL, a `mailto:`, a bare `#anchor` —
 * which is what makes it safe to use for every link rather than only the ones
 * somebody remembered to check.
 *
 * The one link that must NOT use this is the language picker, whose entire job
 * is to leave the current locale.
 */

import Link from "next/link";
import type { ComponentProps } from "react";

import { useLocale } from "@/components/site/locale-provider";
import { localePath } from "@/lib/locale-path";

type LinkProps = ComponentProps<typeof Link>;

export function LocaleLink({ href, ...rest }: LinkProps) {
  const { locale } = useLocale();
  // `href` may be a UrlObject; only the string form is a path we can prefix,
  // and every link on this site writes it as a string.
  const target = typeof href === "string" ? localePath(locale, href) : href;
  return <Link href={target} {...rest} />;
}
