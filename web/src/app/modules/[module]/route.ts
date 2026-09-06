import { MODULES } from "@openmacro/core/content";
import { buildModuleBrief } from "@/lib/module-brief";

/**
 * /modules/<id> — one module as plain text, for a tool that makes video.
 *
 * Served as markdown rather than HTML because the consumer is a document
 * ingester, not a browser: NotebookLM and its equivalents take a URL, fetch
 * it, and extract. Handing them a page means handing them a nav, a footer and
 * a cookie banner to strip; handing them this means handing them the content.
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

  return new Response(buildModuleBrief(found), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      // Long cache: the content only changes when the course is redeployed.
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
