/**
 * Substitute React nodes into a translated string's `{placeholders}`.
 *
 * `translate()` substitutes strings, which covers almost everything. This
 * covers the rest: a sentence with a styled fragment inside it, like a file
 * path in monospace.
 *
 * The alternative — splitting such a sentence into three keys and gluing them
 * back together in JSX — is the classic i18n mistake. It forces every language
 * to keep English word order, and the translator sees three fragments with no
 * indication of how they join. One key with a placeholder in it can be
 * rearranged freely, which is the whole point.
 *
 * Call it with the *template*, so pass `t('some.key')` with no values.
 */

import { Fragment, type ReactNode } from 'react';

export function interpolate(
  template: string,
  nodes: Readonly<Record<string, ReactNode>>,
): ReactNode[] {
  const out: ReactNode[] = [];
  const pattern = /\{(\w+)\}/g;
  let cursor = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(template)) !== null) {
    if (match.index > cursor) out.push(template.slice(cursor, match.index));
    const name = match[1] as string;
    // An unknown placeholder is left visible, matching `translate()`: a
    // stray `{registry}` on screen is a bug report, a silent gap is a mystery.
    out.push(
      name in nodes ? <Fragment key={`${name}-${(key += 1)}`}>{nodes[name]}</Fragment> : match[0],
    );
    cursor = match.index + match[0].length;
  }

  if (cursor < template.length) out.push(template.slice(cursor));
  return out;
}
