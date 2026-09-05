"use client";

import * as React from "react";
import { Check, Copy, FileJson } from "lucide-react";

/**
 * A read-only JSON viewer with copy-to-clipboard.
 *
 * Highlighting is done with a tiny tokeniser rather than a syntax-highlighting
 * library: the site only ever renders one small JSON document, and shipping a
 * highlighter to every visitor for that is not a trade worth making.
 */
export function CodeSnippet({
  code,
  filename,
}: {
  code: string;
  filename: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied (insecure context, permissions).
      // The code is selectable, so failing quietly is acceptable here.
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-abyss">
      <div className="flex items-center justify-between gap-3 border-b border-hairline bg-white/[0.03] px-4 py-2.5">
        <span className="flex items-center gap-2 font-mono text-xs font-bold text-ink-muted">
          <FileJson className="size-3.5 text-mint" aria-hidden />
          {filename}
        </span>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 rounded-lg border border-hairline px-2.5 py-1 text-xs font-bold text-ink-muted transition-colors hover:border-mint/40 hover:text-ink"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-mint" aria-hidden />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5" aria-hidden />
              Copy
            </>
          )}
        </button>
      </div>

      <pre className="max-h-[26rem] overflow-auto p-4 font-mono text-[0.78rem] leading-relaxed">
        <code>
          {code.split("\n").map((line, index) => (
            <span key={index} className="block">
              {highlight(line)}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

/** Matches JSON keys, string values, numbers, booleans and punctuation. */
const TOKEN = /("(?:[^"\\]|\\.)*"\s*:)|("(?:[^"\\]|\\.)*")|(-?\d+\.?\d*)|(\btrue\b|\bfalse\b|\bnull\b)/g;

const CLASS_BY_GROUP = [
  "text-[#8ab0ff]", // key
  "text-mint-bright", // string value
  "text-gold", // number
  "text-violet", // literal
];

/** Splits one line into coloured spans. Returns plain text if nothing matches. */
function highlight(line: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  TOKEN.lastIndex = 0;
  while ((match = TOKEN.exec(line)) !== null) {
    if (match.index > cursor) {
      nodes.push(line.slice(cursor, match.index));
    }
    const groupIndex = match.slice(1).findIndex((group) => group !== undefined);
    nodes.push(
      <span key={match.index} className={CLASS_BY_GROUP[groupIndex] ?? "text-ink"}>
        {match[0]}
      </span>,
    );
    cursor = match.index + match[0].length;
  }

  if (cursor < line.length) nodes.push(line.slice(cursor));
  return nodes.length > 0 ? nodes : line;
}
