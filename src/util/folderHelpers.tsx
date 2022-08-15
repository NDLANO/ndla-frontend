/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HashTag, Person } from '@ndla/icons/common';
import { TFunction } from 'i18next';
import { uniq, uniqBy } from 'lodash';
import { GQLFolder, GQLFolderResource } from '../graphqlTypes';

export const getAllTags = (allFolders: GQLFolder[]): string[] => {
  const allTags = allFolders.flatMap(f =>
    f.resources.flatMap(r => r.tags).concat(getAllTags(f.subfolders)),
  );
  return uniq(allTags);
};

export const getAllResources = (
  allFolders: GQLFolder[],
): GQLFolderResource[] => {
  const allResources = allFolders.flatMap(f =>
    f.resources.concat(getAllResources(f.subfolders)),
  );
  return uniq(allResources);
};

export const getResourceForPath = (
  allFolders: GQLFolder[],
  path: string,
): GQLFolderResource | undefined => {
  return getAllResources(allFolders).find(r => r.path === path);
};

export const getResourcesForTag = (
  allFolders: GQLFolder[],
  tag: string,
): GQLFolderResource[] => {
  const resources = allFolders.flatMap(f =>
    f.resources
      .filter(r => r.tags.some(t => t === tag))
      .concat(getResourcesForTag(f.subfolders, tag)),
  );
  return uniqBy(resources, r => r.id);
};

export const createStaticStructureElements = (
  folders: GQLFolder[],
  t: TFunction,
) => {
  return [
    {
      id: '',
      name: t('myNdla.myPage.myPage'),
      icon: <Person />,
      status: 'private',
      subfolders: [],
      breadcrumbs: [],
      resources: [],
    },
    {
      id: 'folders',
      name: t('myNdla.myFolders'),
      status: 'private',
      subfolders: folders,
      breadcrumbs: [],
      resources: [],
    },
    {
      id: 'tags',
      icon: <HashTag />,
      name: t('myNdla.myTags'),
      status: 'private',
      subfolders: [],
      breadcrumbs: [],
      resources: [],
    },
  ];
};
