/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Manifest, ManifestChunk } from "vite";
import { entryPoints, EntryPointType } from "../entrypoints";
import { RouteChunkInfo } from "./serverHelpers";
import config from "../config";

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

export const getRouteChunkInfo = (manifest: Manifest, entryPoint: EntryPointType): RouteChunkInfo => {
  if (config.runtimeType === "development") {
    return { entryPoint: entryPoints[entryPoint] };
  }
  const mainEntry = manifest[entryPoints[entryPoint]];
  if (!mainEntry) return {};
  const stylesheets = Object.entries(manifest)
    .filter(([key]) => key.endsWith(".css"))
    .map(([, value]) => value);
  mainEntry.css = (mainEntry.css ?? []).concat(stylesheets.map((chunk) => chunk.file));
  const importedChunks = getImportedChunks(manifest, entryPoints[entryPoint]);

  return {
    entryPoint: mainEntry.file,
    importedChunks: importedChunks.map((chunk) => chunk.file),
    css: getUniqueCss([mainEntry].concat(importedChunks)),
  };
};

export const getUniqueCss = (chunks: ManifestChunk[]) => {
  const uniq = chunks.reduce((acc, curr) => {
    curr.css?.forEach((css) => acc.add(css));
    return acc;
  }, new Set<string>());
  return Array.from(uniq);
};
