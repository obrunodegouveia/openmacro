import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { Outcome, Title } from './parts';
import { BASELINE, COPY, GIVEN_AWAY, KEPT, compute, type Locale } from './script';
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
      <Sequence durationInFrames={s(4)}>
        <Stage>
          <Title text={t.hook} sub={t.hookSub} accent={palette.coral} />
        </Stage>
      </Sequence>

      <Sequence from={s(4)} durationInFrames={s(8)}>
        <Stage>
          <Title text={t.race} sub={t.raceSub} accent={palette.gold} />
        </Stage>
      </Sequence>

      <Sequence from={s(12)} durationInFrames={s(8)}>
        <Stage>
          <Title text={t.lever} sub={t.leverSub} />
        </Stage>
      </Sequence>

      <Sequence from={s(20)} durationInFrames={s(8)}>
        <Stage>
          <Title text={t.twist} sub={t.twistSub} accent={palette.gold} />
        </Stage>
      </Sequence>

      {/* The two outcomes, side by side and sharing a scale. */}
      <Sequence from={s(28)} durationInFrames={s(28)}>
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

      <Sequence from={s(56)} durationInFrames={s(12)}>
        <Stage>
          <Title text={t.punch} sub={t.punchSub} accent={palette.mint} />
        </Stage>
      </Sequence>

      <Sequence from={s(68)} durationInFrames={s(7)}>
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
