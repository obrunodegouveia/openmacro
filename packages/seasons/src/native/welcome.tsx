/**
 * The seasonal welcome by name, staged in the season's own air: a glow
 * blooming, the season's motes rising, the card springing in over a burst
 * of its particles. "Happy Halloween, Maria!"
 *
 * The package draws it; the app decides *when*: usually once a day per
 * signed-in user, remembered in its own storage, with the first name from
 * its own account. Never in the calm look, which has no popups.
 */

import { useSeason, useSeasonContext, useSeasonScheme } from './context.tsx';
import { WelcomeStage } from './visuals/WelcomeStage.tsx';

/**
 * The welcome overlay. Place it last inside the root view of the screen (or
 * the tab layout) it should cover, and render it with a `name` only when it
 * is time to greet.
 *
 * @param props.name Who to greet, or `null` for nothing.
 * @param props.onDismiss A tap anywhere, or the app's own timer, closes it.
 * @param props.maxTitleScale A Dynamic Type cap for the title. Default 1.7.
 * @return The welcome, or nothing without a name, a season, or in the calm look.
 */
export function SeasonWelcome({ name, onDismiss, maxTitleScale = 1.7 }: { name: string | null; onDismiss: () => void; maxTitleScale?: number }) {
  const season = useSeason();
  const scheme = useSeasonScheme();
  const { translate, chrome } = useSeasonContext();
  if (!name || !season || season.calm) return null;
  const welcome = translate(season.pack.strings.welcome, { name });
  const colors = chrome(season, scheme).welcome;
  const { motes } = season.pack.look;
  // The season's own air rises through the stage: its colours, its motion,
  // and the shape of its nearest drawn particles.
  const shape = [...motes.layers].reverse().find((layer) => !layer.emoji)?.shape;

  return (
    <WelcomeStage
      emoji={season.pack.welcome}
      title={welcome}
      particles={season.pack.particles}
      colors={{ ...colors, glow: season.pack.look.burst.ring }}
      motes={{
        colors: motes.colors.map((color) => color[scheme]),
        motion: motes.motion,
        direction: motes.direction,
        shape,
        glow: motes.glow,
      }}
      animate={season.motion}
      onDismiss={onDismiss}
      label={welcome}
      hint={translate('season.welcomeDismiss')}
      maxTitleScale={maxTitleScale}
    />
  );
}
