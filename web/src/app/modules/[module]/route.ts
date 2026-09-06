import { MODULES } from "@openmacro/core/content";
import { buildModuleBriefHtml } from "@/lib/module-brief";

/**
 * /modules/<id> — one module as plain text, for a tool that makes video.
 *
 * A bare HTML page, because the consumer is a document ingester rather than a
 * reader: NotebookLM takes a URL, fetches it, and imports the visible text.
 * Handing it the normal site means handing it a nav, a footer and a cookie
 * banner to strip; handing it this means handing it the content and nothing
 * else.
 *
 * It has to be HTML specifically. Serving the same bytes as text/markdown gets
 * "This URL type is not supported" and the source is rejected outright.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return MODULES.map((module) => ({ module: module.id }));
}

export const dynamicParams = false;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ module: string }> },
) {
  const { module: id } = await params;
  const found = MODULES.find((candidate) => candidate.id === id);
  if (!found) return new Response("Not found", { status: 404 });

  return new Response(buildModuleBriefHtml(found), {
    headers: {
      // HTML, not markdown. NotebookLM refuses text/markdown with "this URL
      // type is not supported" — tested, not assumed.
      "content-type": "text/html; charset=utf-8",
      // Long cache: the content only changes when the course is redeployed.
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
