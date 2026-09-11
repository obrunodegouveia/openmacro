/**
 * ============================================================================
 * no-untranslated-text
 * ============================================================================
 *
 * Fails on a user-visible string written directly into JSX instead of coming
 * from `t()`.
 *
 * This exists because every other check in this repository is blind to the
 * failure that actually happens. `typecheck` is happy — a string is a string.
 * `i18n:status --strict` is happy, and worse than happy: it reports the
 * interface as 100% translated, because it can only measure keys that exist
 * and a hard-coded string never became a key. So the one thing that silently
 * un-translates the app is the one thing nothing was watching.
 *
 * ---------------------------------------------------------------------------
 * WHY NOT `react/jsx-no-literals`
 * ---------------------------------------------------------------------------
 *
 * It is the obvious answer and it does not survive contact with React Native.
 * With `noAttributeStrings` on it flags `accessibilityRole="button"`,
 * `keyboardType="email-address"`, `autoCapitalize="none"`, `tone="primary"` —
 * dozens of props that are API values, not prose. A rule that is wrong that
 * often gets switched off, and a switched-off rule protects nothing.
 *
 * So this one is narrow on purpose. It reports exactly two things:
 *
 *   • JSX text children        <Text>Reset progress</Text>
 *   • strings in props that a human reads, listed in `props` below
 *
 * and only when the string contains two consecutive letters, so separators,
 * glyphs and emoji (`·`, `✕`, `↻`, `›`, `❤️`, `+`) pass without an exemption.
 *
 * ---------------------------------------------------------------------------
 * HOW IT TELLS `t('lesson.check')` FROM `"Check"`
 * ---------------------------------------------------------------------------
 *
 * Structurally, not by naming `t`. A string that is an argument to any call is
 * skipped, which covers `t('key')`, `t('key', {...})` and
 * `interpolate(t('key'), ...)` without the rule knowing what those functions
 * are — and equally covers `StyleSheet.create({ fontFamily: 'Courier' })`.
 *
 * The consequence worth knowing: a string passed to some *other* function and
 * then rendered is invisible to this rule. That is the price of not
 * hard-coding a translator's name into a lint rule, and it is a much smaller
 * hole than the one being closed.
 */

/** Two consecutive letters, in any script. Prose, rather than punctuation. */
const PROSE = /\p{L}{2}/u;

/** The name of the JSX attribute a node sits in, or null. */
function attributeName(node) {
  const name = node.name;
  if (!name) return null;
  if (name.type === 'JSXIdentifier') return name.name;
  if (name.type === 'JSXNamespacedName') return name.name.name;
  return null;
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require user-visible strings to come from the translation catalogue rather than being written into JSX.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          /** Props whose string value a person reads. */
          props: { type: 'array', items: { type: 'string' } },
          /** Strings that are deliberately never translated — brand names. */
          allow: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      text: 'Untranslated text "{{text}}". Add a key to packages/core/src/i18n/ui/en.ts and render t(\'that.key\').',
      prop: 'Untranslated string in `{{prop}}`: "{{text}}". Screen reader users get a language too — add a key and pass t(\'that.key\').',
    },
  },

  create(context) {
    const options = context.options[0] ?? {};
    const props = new Set(
      options.props ?? [
        'accessibilityLabel',
        'accessibilityHint',
        'aria-label',
        'label',
        'title',
        'placeholder',
        'hint',
        'continueLabel',
        'alt',
      ],
    );
    const allow = new Set(options.allow ?? []);

    const isProse = (value) =>
      typeof value === 'string' && PROSE.test(value) && !allow.has(value.trim());

    /**
     * Where a string literal sits, from the reader's point of view.
     *
     * Walks outward from the literal. Bailing at the first `CallExpression` is
     * what makes `t('lesson.check')` invisible without naming `t`.
     */
    function classify(node) {
      let parent = node.parent;
      while (parent) {
        switch (parent.type) {
          case 'CallExpression':
          case 'NewExpression':
          case 'TaggedTemplateExpression':
            return null;

          // A string being *compared* is not a string being *rendered*.
          // `{direction === 'expand' ? t('…') : t('…')}` renders two
          // translated strings and tests against a schema value, and only the
          // first two are this rule's business.
          case 'BinaryExpression':
          case 'SwitchCase':
            return null;

          case 'JSXAttribute': {
            const name = attributeName(parent);
            return name && props.has(name) ? { kind: 'prop', name } : null;
          }

          case 'JSXExpressionContainer':
            // A child of an element is rendered text. Inside an attribute it
            // is not, so keep walking out to find which attribute.
            if (
              parent.parent &&
              (parent.parent.type === 'JSXElement' || parent.parent.type === 'JSXFragment')
            ) {
              return { kind: 'text' };
            }
            break;

          case 'JSXElement':
          case 'JSXFragment':
          case 'Program':
            return null;

          default:
            break;
        }
        parent = parent.parent;
      }
      return null;
    }

    function reportLiteral(node, value) {
      if (!isProse(value)) return;
      const where = classify(node);
      if (!where) return;
      const text = value.trim().slice(0, 40);
      if (where.kind === 'prop') {
        context.report({ node, messageId: 'prop', data: { prop: where.name, text } });
      } else {
        context.report({ node, messageId: 'text', data: { text } });
      }
    }

    return {
      JSXText(node) {
        if (!isProse(node.value)) return;
        context.report({
          node,
          messageId: 'text',
          data: { text: node.value.trim().replace(/\s+/g, ' ').slice(0, 40) },
        });
      },

      Literal(node) {
        reportLiteral(node, node.value);
      },

      TemplateLiteral(node) {
        // `Play ${title}` is prose; `${a}:${b}` is a key. Judge on the fixed
        // parts only, so an interpolated id never looks like a sentence.
        const fixed = node.quasis.map((quasi) => quasi.value.cooked ?? '').join(' ');
        reportLiteral(node, fixed);
      },
    };
  },
};
