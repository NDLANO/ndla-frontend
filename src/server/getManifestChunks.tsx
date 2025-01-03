/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Manifest, ManifestChunk } from "vite";
import { entryPoints, EntryPointType } from "../entrypoints";

function getImportedChunks(manifest: Manifest, name: string): ManifestChunk[] {
  const seen = new Set<string>();

  function getImportedChunks(chunk: ManifestChunk): ManifestChunk[] {
    const chunks: ManifestChunk[] = [];
    for (const file of chunk.imports ?? []) {
      const importee = manifest[file]!;
      if (seen.has(file)) {
        continue;
      }
      seen.add(file);

      chunks.push(...getImportedChunks(importee));
      chunks.push(importee);
    }

    return chunks;
  }

  return getImportedChunks(manifest[name]!);
}

export const getRouteChunks = (manifest: Manifest, entryPoint: EntryPointType): ManifestChunk[] => {
  const mainEntry = manifest[entryPoints[entryPoint]];
  if (!mainEntry) return [];
  const importedChunks = getImportedChunks(manifest, entryPoints[entryPoint]);
  return [mainEntry].concat(importedChunks);
};
