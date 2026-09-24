import React from 'react';
import { Composition } from 'remotion';
import { TOTAL_SECONDS } from './scenes';
import { SpendItTwice } from './SpendItTwice';

const FPS = 30;

export const Root: React.FC = () => (
  <>
    <Composition
      id="spend-it-twice-en"
      component={SpendItTwice}
      durationInFrames={FPS * TOTAL_SECONDS}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{ locale: 'en' as const }}
    />
    <Composition
      id="spend-it-twice-pt"
      component={SpendItTwice}
      durationInFrames={FPS * TOTAL_SECONDS}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{ locale: 'pt-PT' as const }}
    />
  </>
);
