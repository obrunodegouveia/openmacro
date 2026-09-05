import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * robots.txt.
 *
 * The wildcard rule already permits every crawler, so the named AI agents
 * below are not strictly necessary. They are listed explicitly for two
 * reasons: it records a deliberate decision that this content may be used to
 * answer questions, and it means a future `Disallow` added to the wildcard
 * rule cannot silently cut off assistants as a side effect.
 *
 * Being listed here is a permission, not a guarantee — no crawler is obliged
 * to read the site, and robots.txt cannot make an assistant cite it.
 *
 * `Google-Extended` is the token that governs Gemini grounding and training;
 * it is separate from Googlebot, and blocking it does not affect search
 * ranking. `/api/` stays disallowed everywhere: those routes accept POSTs and
 * return no content worth indexing.
 */
const AI_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "cohere-ai",
  "Meta-ExternalAgent",
  "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      ...AI_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: "/api/",
      })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
