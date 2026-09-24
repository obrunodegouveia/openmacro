import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { font, palette } from './theme';

/** Fade-and-rise, the only entrance in the film. Used everywhere for calm. */
export const Enter: React.FC<{ delay?: number; children: React.ReactNode }> = ({
  delay = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return (
    <div style={{ opacity: t, transform: `translateY(${interpolate(t, [0, 1], [24, 0])}px)` }}>
      {children}
    </div>
  );
};

export const Title: React.FC<{ text: string; sub?: string; accent?: string }> = ({
  text,
  sub,
  accent = palette.mint,
}) => (
  <div style={{ textAlign: 'center', maxWidth: 1500 }}>
    <Enter>
      <div style={{ fontFamily: font, fontSize: 76, fontWeight: 800, color: '#fff', lineHeight: 1.15 }}>
        {text}
      </div>
    </Enter>
    {sub ? (
      <Enter delay={12}>
        <div style={{ fontFamily: font, fontSize: 40, fontWeight: 600, color: accent, marginTop: 28 }}>
          {sub}
        </div>
      </Enter>
    ) : null}
  </div>
);

/**
 * A number that counts up to its value.
 *
 * Counting is the whole grammar of this film: the argument is that one number
 * moves a long way and the other barely moves, and a reader should watch that
 * happen rather than be told it.
 */
export const Counter: React.FC<{
  to: number;
  delay?: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
  colour?: string;
  size?: number;
}> = ({ to, delay = 0, duration = 40, suffix = '', decimals = 2, colour = '#fff', size = 150 }) => {
  const frame = useCurrentFrame();
  const value = interpolate(frame - delay, [0, duration], [0, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <span
      style={{
        fontFamily: font,
        fontSize: size,
        fontWeight: 800,
        color: colour,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: -2,
      }}
    >
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};

/**
 * One scenario: a label, the resulting fall in the debt ratio, and a bar
 * whose length is that number. Both bars share a scale, so the comparison is
 * the picture rather than the caption.
 */
export const Outcome: React.FC<{
  label: string;
  sub: string;
  growth: number;
  snowball: number;
  delay: number;
  colour: string;
  growthLabel: string;
  perYear: string;
  maxMagnitude: number;
}> = ({ label, sub, growth, snowball, delay, colour, growthLabel, perYear, maxMagnitude }) => {
  const frame = useCurrentFrame();
  const width = interpolate(frame - delay - 12, [0, 36], [0, Math.abs(snowball) / maxMagnitude], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{ width: 760 }}>
      <Enter delay={delay}>
        <div style={{ fontFamily: font, fontSize: 40, fontWeight: 800, color: '#fff' }}>{label}</div>
        <div style={{ fontFamily: font, fontSize: 28, fontWeight: 600, color: palette.inkFaint, marginTop: 6 }}>
          {sub}
        </div>
        <div style={{ fontFamily: font, fontSize: 28, fontWeight: 600, color: palette.inkMuted, marginTop: 22 }}>
          {growthLabel} {(growth * 100).toFixed(2)}%
        </div>
      </Enter>

      <div style={{ marginTop: 18, display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <Counter to={snowball * 100} delay={delay + 12} suffix="pp" colour={colour} size={128} />
        <span style={{ fontFamily: font, fontSize: 26, fontWeight: 600, color: palette.inkMuted }}>
          {perYear}
        </span>
      </div>

      <div
        style={{
          marginTop: 14,
          height: 26,
          width: '100%',
          background: palette.surface,
          borderRadius: 13,
          border: `1px solid ${palette.border}`,
          overflow: 'hidden',
        }}
      >
        <div style={{ height: '100%', width: `${width * 100}%`, background: colour, borderRadius: 13 }} />
      </div>
    </div>
  );
};
