/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { TFunction } from "i18next";
import { GQLFolder, GQLFolderResource, GQLFolderResourceResourceType, GQLSharedFolder } from "../graphqlTypes";
import { uniqBy } from "./uniq";

export const getAllTags = (allFolders: GQLFolder[]): string[] => {
  const allTags = allFolders.flatMap((f) => f.resources.flatMap((r) => r.tags).concat(getAllTags(f.subfolders)));
  return [...new Set(allTags)];
};

export const getAllResources = (allFolders: GQLFolder[]): GQLFolderResource[] => {
  const allResources = allFolders.flatMap((f) => f.resources.concat(getAllResources(f.subfolders)));
  return [...new Set(allResources)];
};

export const getResourceForPath = (allFolders: GQLFolder[], path: string): GQLFolderResource | undefined => {
  return getAllResources(allFolders).find((r) => r.path === path);
};

export interface FolderTotalCount {
  folders: number;
  resources: number;
}

export const getTotalCountForFolder = (folder: GQLFolder | GQLSharedFolder): FolderTotalCount => {
  return folder.subfolders.reduce<FolderTotalCount>(
    (acc, curr) => {
      const subTotal = getTotalCountForFolder(curr);
      return {
        folders: acc.folders + subTotal.folders,
        resources: acc.resources + subTotal.resources,
      };
    },
    {
      folders: folder.subfolders.length,
      resources: folder.resources.length,
    },
  );
};

export const getResourcesForTag = (allFolders: GQLFolder[], tag: string): GQLFolderResource[] => {
  const resources = allFolders.flatMap((f) =>
    f.resources.filter((r) => r.tags.some((t) => t === tag)).concat(getResourcesForTag(f.subfolders, tag)),
  );
  return uniqBy(resources, (r) => r.id);
};

export const getResourceTypesForResource = (
  resourceType: string,
  metaResourceTypes: GQLFolderResourceResourceType[] | undefined,
  t: TFunction,
): GQLFolderResourceResourceType[] => {
  if (metaResourceTypes?.length) {
    return metaResourceTypes;
  }
  return [{ id: resourceType, name: t(`contentTypes.${resourceType}`) }];
};
