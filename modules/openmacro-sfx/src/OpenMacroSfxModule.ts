import { NativeModule, requireOptionalNativeModule } from 'expo';

declare class OpenMacroSfxModule extends NativeModule<{}> {
  /** Decodes a local sound file into memory under `id`. */
  load(id: string, uri: string): Promise<void>;
  /** Plays a loaded clip now; false when it cannot. */
  play(id: string): boolean;
  /**
   * What the hardware granted, in ms, or null before the engine starts. iOS
   * only, and absent from binaries older than build 37: check before calling.
   */
  latency?(): { ioBuffer: number; output: number; sampleRate: number } | null;
}

/**
 * The native player, or null in a binary built before this module existed.
 * Optional on purpose: JS updates reach older builds too, and those must keep
 * using `expo-audio`.
 */
export default requireOptionalNativeModule<OpenMacroSfxModule>('OpenMacroSfx');
