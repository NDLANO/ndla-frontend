/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Manifest, ManifestChunk } from "vite";
import { uniq } from "@ndla/util";
import { matchRoutes } from "react-router";
import config from "../config";
import { entryPoints, EntryPointType } from "../entrypoints";
import { RouteObjectWithImportPath } from "../interfaces";
import { RouteChunkInfo, RouteChunkInfoWithManifest } from "./serverHelpers";

export const getLazyLoadedChunks = (
  routes: RouteObjectWithImportPath[],
  path: string,
  { manifest, ...chunkInfo }: RouteChunkInfoWithManifest,
) => {
  const lazyMatches = matchRoutes(routes, path)?.filter((route) => route.route.importPath) ?? [];
  const existingChunks = new Set(chunkInfo.importedChunks ?? []);
  const lazyChunks = lazyMatches.flatMap((match) =>
    getImportedChunks(manifest[match.route.importPath!]!, manifest, existingChunks),
  );

  const lazyMatchFiles = lazyMatches.map((lm) => manifest[lm.route.importPath!]?.file).filter(Boolean) as string[];

  const allImportedChunks = uniq(
    (chunkInfo.importedChunks ?? []).concat(lazyMatchFiles).concat(lazyChunks.map((chunk) => chunk.file)),
  );

  const lazyChunkInfo: RouteChunkInfo = {
    ...chunkInfo,
    importedChunks: allImportedChunks,
  };

  return lazyChunkInfo;
};

export function getImportedChunks(chunk: ManifestChunk, manifest: Manifest, seen: Set<string>): ManifestChunk[] {
  const chunks: ManifestChunk[] = [];
  for (const file of chunk?.imports ?? []) {
    const importee = manifest[file]!;
    if (seen.has(file)) {
      continue;
    }
    seen.add(file);

    chunks.push(...getImportedChunks(importee, manifest, seen));
    chunks.push(importee);
  }

  return chunks;
}

export const getRouteChunkInfo = (manifest: Manifest, entryPoint: EntryPointType): RouteChunkInfoWithManifest => {
  if (config.runtimeType === "development") {
    return { entryPoint: entryPoints[entryPoint], manifest };
  }
  const mainEntry = manifest[entryPoints[entryPoint]];
  if (!mainEntry) return { manifest };
  const stylesheets = Object.entries(manifest)
    .filter(([key]) => key.endsWith(".css"))
    .map(([, value]) => value);
  mainEntry.css = (mainEntry.css ?? []).concat(stylesheets.map((chunk) => chunk.file));
  const importedChunks = getImportedChunks(manifest[entryPoints[entryPoint]]!, manifest, new Set<string>());

  return {
    entryPoint: mainEntry.file,
    importedChunks: importedChunks.map((chunk) => chunk.file),
    css: getUniqueCss([mainEntry].concat(importedChunks)),
    manifest,
  };
};

export const getUniqueCss = (chunks: ManifestChunk[]) => {
  const uniq = chunks.reduce((acc, curr) => {
    curr.css?.forEach((css) => acc.add(css));
    return acc;
  }, new Set<string>());
  return Array.from(uniq);
};
