"use client";

import * as React from "react";
import { SeasonProvider } from "@openmacro/seasons/web/provider";
import type { TranslateValues } from "@openmacro/seasons/presets";
import { SEASON_PACKS } from "@openmacro/core/season";
import type { UiKey } from "@openmacro/core/i18n";
import { useLocale } from "@/components/site/locale-provider";
import { seasonController } from "@/lib/season";
import { SEASON_ART } from "./art";

/**
 * The site's season provider: `SeasonProvider` from
 * `@openmacro/seasons/web`, given this site's controller, packs, words and
 * Halloween artwork. The same few lines another site writes.
 *
 * Mounted once in the root layout, inside the locale provider. It also keeps
 * <html> dressed for the live decision (the visitor's switch, a remote kill
 * switch, midnight) and checks again when the tab comes back into view.
 * Light: the decorations themselves load lazily (`seasonal-decor.tsx`).
 *
 * @param props.children The page.
 * @return The provider.
 */
export function SeasonsProvider({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();
  const translate = React.useCallback((key: string, values?: TranslateValues) => t(key as UiKey, values), [t]);
  return (
    <SeasonProvider controller={seasonController()} packs={SEASON_PACKS} translate={translate} art={SEASON_ART}>
      {children}
    </SeasonProvider>
  );
}
