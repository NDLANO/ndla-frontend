/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export interface MovieTag {
  id: string;
  name: string;
}

export const movieTagFilters: Record<string, MovieTag[]> = {
  nb: [
    { id: "Dokumentarfilm", name: "Dokumentarfilm" },
    { id: "Spillefilm", name: "Spillefilm" },
    { id: "Serier", name: "Serier" },
    { id: "Kortfilm", name: "Kortfilm" },
  ],
  nn: [
    { id: "Dokumentarfilm", name: "Dokumentarfilm" },
    { id: "Spelefilm", name: "Spelefilm" },
    { id: "Seriar", name: "Seriar" },
    { id: "Kortfilm", name: "Kortfilm" },
  ],
  en: [
    { id: "Documentary", name: "Documentary" },
    { id: "Feature Film", name: "Feature Film" },
    { id: "Series", name: "Series" },
    { id: "Short Film", name: "Short Film" },
  ],
  se: [
    { id: "Dokumentarfilm", name: "Dokumentarfilm" },
    { id: "Spillefilm", name: "Spillefilm" },
    { id: "TV-serie", name: "TV-serie" },
    { id: "Kortfilm", name: "Kortfilm" },
  ],
};
