/**
 * Synchronous storage for the season controller: one small JSON file.
 *
 * The palette is baked into every stylesheet as its module loads, so the
 * season it paints has to be known before the first frame, which rules out
 * AsyncStorage: its first answer comes back after the stylesheets are made.
 * `expo-file-system` reads synchronously and is already in every binary
 * (it ships with `expo` itself), so this costs no native change and the
 * whole feature stays deliverable as an over-the-air update.
 */

import { File, Paths } from 'expo-file-system';

import type { SeasonStorage } from '@openmacro/seasons';

/**
 * A key-value store kept in one JSON file under the documents directory.
 *
 * Every read and write goes to disk: the file holds two short entries and is
 * touched a handful of times per launch, so a cache would buy nothing and
 * could disagree with the disk.
 *
 * @param name The file name.
 * @return The storage. Its methods may throw; the controller catches them.
 */
export function fileStorage(name: string): SeasonStorage {
  const file = new File(Paths.document, name);

  const readAll = (): Record<string, string> => {
    if (!file.exists) return {};
    const parsed: unknown = JSON.parse(file.textSync());
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, string>) : {};
  };

  return {
    get(key) {
      const value = readAll()[key];
      return typeof value === 'string' ? value : null;
    },
    set(key, value) {
      let all: Record<string, string>;
      try {
        all = readAll();
      } catch {
        // A corrupt file is replaced rather than kept forever.
        all = {};
      }
      all[key] = value;
      if (!file.exists) file.create();
      file.write(JSON.stringify(all));
    },
  };
}
