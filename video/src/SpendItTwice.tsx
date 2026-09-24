import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { Outcome, Title } from './parts';
import { BASELINE, COPY, GIVEN_AWAY, KEPT, compute, type Locale } from './script';
import { SCENES, lengthOf, startOf, type SceneId } from './scenes';
import { font, palette } from './theme';

/**
 * "You cannot spend the productivity gain twice" — the sharpest idea in the
 * debt module, at about seventy-five seconds.
 *
 * Every figure is computed by `compute`, which calls the same formulas the
 * course grades with. If `debt_snowball` changes, this film changes.
 */

const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: palette.canvas,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 100,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const SpendItTwice: React.FC<{ locale: Locale }> = ({ locale }) => {
  const { fps } = useVideoConfig();
  const t = COPY[locale];
  const s = (seconds: number) => Math.round(seconds * fps);

  const kept = compute(KEPT);
  const given = compute(GIVEN_AWAY);
  const base = compute(BASELINE);
  const scale = Math.max(Math.abs(kept.snowball), Math.abs(given.snowball));

  return (
    <AbsoluteFill style={{ background: palette.canvas }}>
      {/* Narration, one clip per scene rather than one long take.
          A single file would slide against the picture the moment any scene
          length changed; pinning each line to its own `Sequence` means the
          timeline in `scenes.ts` is the only thing that decides when anything
          happens, sound and image alike. */}
      {SCENES.map((scene, index) => (
        <Sequence
          key={scene.id}
          from={s(startOf(scene.id as SceneId))}
          durationInFrames={s(scene.seconds)}
        >
          <Audio src={staticFile(`narration/${locale}/${index}.m4a`)} />
        </Sequence>
      ))}

      <Sequence durationInFrames={s(lengthOf('hook'))}>
        <Stage>
          <Title text={t.hook} sub={t.hookSub} accent={palette.coral} />
        </Stage>
      </Sequence>

      <Sequence from={s(startOf('race'))} durationInFrames={s(lengthOf('race'))}>
        <Stage>
          <Title text={t.race} sub={t.raceSub} accent={palette.gold} />
        </Stage>
      </Sequence>

      <Sequence from={s(startOf('lever'))} durationInFrames={s(lengthOf('lever'))}>
        <Stage>
          <Title text={t.lever} sub={t.leverSub} />
        </Stage>
      </Sequence>

      <Sequence from={s(startOf('twist'))} durationInFrames={s(lengthOf('twist'))}>
        <Stage>
          <Title text={t.twist} sub={t.twistSub} accent={palette.gold} />
        </Stage>
      </Sequence>

      {/* The two outcomes, side by side and sharing a scale. */}
      <Sequence from={s(startOf('outcomes'))} durationInFrames={s(lengthOf('outcomes'))}>
        <Stage>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 64 }}>
            {/* The question the two columns answer, kept on screen the whole
                time they are. Without it a viewer meets two numbers with no
                idea what is being compared. */}
            <div
              style={{
                fontFamily: font,
                fontSize: 52,
                fontWeight: 800,
                color: '#fff',
                textAlign: 'center',
              }}
            >
              {t.twistSub}
            </div>
            <div style={{ display: 'flex', gap: 120, alignItems: 'flex-start' }}>
            <Outcome
              label={t.keptLabel}
              sub={t.keptSub}
              growth={kept.nominalGrowth}
              snowball={kept.snowball}
              delay={0}
              colour={palette.mint}
              growthLabel={t.growthLabel}
              perYear={t.perYear}
              maxMagnitude={scale}
            />
            <Outcome
              label={t.givenLabel}
              sub={t.givenSub}
              growth={given.nominalGrowth}
              snowball={given.snowball}
              delay={s(12)}
              colour={palette.coral}
              growthLabel={t.growthLabel}
              perYear={t.perYear}
              maxMagnitude={scale}
            />
            </div>
          </div>
        </Stage>
      </Sequence>

      <Sequence from={s(startOf('punch'))} durationInFrames={s(lengthOf('punch'))}>
        <Stage>
          <Title text={t.punch} sub={t.punchSub} accent={palette.mint} />
        </Stage>
      </Sequence>

      <Sequence from={s(startOf('outro'))} durationInFrames={s(lengthOf('outro'))}>
        <Stage>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: font, fontSize: 92, fontWeight: 800, color: palette.mint }}>
              {t.outro}
            </div>
            <div
              style={{
                fontFamily: font,
                fontSize: 34,
                fontWeight: 600,
                color: palette.inkFaint,
                marginTop: 20,
              }}
            >
              {t.outroSub}
            </div>
            {/* Proof the film is made of the course: the baseline it starts
                from, in the same units as everything above. */}
            <div
              style={{
                fontFamily: font,
                fontSize: 24,
                fontWeight: 600,
                color: palette.inkMuted,
                marginTop: 44,
              }}
            >
              {`${t.growthLabel} ${(base.nominalGrowth * 100).toFixed(2)}% → ${(base.snowball * 100).toFixed(2)}pp`}
            </div>
          </div>
        </Stage>
      </Sequence>
    </AbsoluteFill>
  );
};
