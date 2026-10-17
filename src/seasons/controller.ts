/**
 * The app's season controller: OpenMacro's calendar, wired to this device.
 *
 * Created when this module first loads, which is before any stylesheet, so
 * `seasons.boot` is settled by the time `src/theme/tokens.ts` paints with
 * it. Deliberately free of React and of the theme, so tokens can import it
 * without a cycle.
 *
 * `EXPO_PUBLIC_SEASON` forces a look in a dev build (`christmas`,
 * `christmas:calm`, `none`), so a season can be checked in July.
 */

import { createSeasonController } from '@openmacro/seasons';
import { SEASONS, SEASONS_KEY_PREFIX, SEASONS_REMOTE_URL } from '@openmacro/core/season';

import { fileStorage } from './storage';

export const seasons = createSeasonController({
  calendar: SEASONS,
  storage: fileStorage('seasons.json'),
  override: process.env.EXPO_PUBLIC_SEASON,
  remote: { url: SEASONS_REMOTE_URL },
  keyPrefix: SEASONS_KEY_PREFIX,
});
