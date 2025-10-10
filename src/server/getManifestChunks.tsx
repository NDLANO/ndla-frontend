/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Manifest, ManifestChunk } from "vite";
import { entryPoints, EntryPointType } from "../entrypoints";

function getImportedChunks(manifest: Manifest, entrypoint: string, filePaths: string[]): ManifestChunk[] {
  const seen = new Set<string>();

  function getImportedChunks(chunk: ManifestChunk): ManifestChunk[] {
    const chunks: ManifestChunk[] = [];
    for (const file of chunk?.imports ?? []) {
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

  const entrypointChunks = getImportedChunks(manifest[entrypoint]!);
  const filePathsChunks = filePaths.flatMap((fp) => getImportedChunks(manifest[fp]!));

  return entrypointChunks.concat(filePathsChunks);
}

export const getRouteChunks = (
  manifest: Manifest,
  entryPoint: EntryPointType,
  filePaths: string[],
): ManifestChunk[] => {
  const mainEntry = manifest[entryPoints[entryPoint]];
  if (!mainEntry) return [];
  const stylesheets = Object.entries(manifest)
    .filter(([key]) => key.endsWith(".css"))
    .map(([, value]) => value);
  mainEntry.css = (mainEntry.css ?? []).concat(stylesheets.map((chunk) => chunk.file));
  const importedChunks = getImportedChunks(manifest, entryPoints[entryPoint], filePaths);
  return [mainEntry].concat(importedChunks);
};
