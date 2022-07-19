/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { uniq, uniqBy } from 'lodash';
import { GQLFolder, GQLFolderResource } from '../graphqlTypes';

export const getAllTags = (allFolders: GQLFolder[]): string[] => {
  const allTags = allFolders.flatMap(f =>
    f.resources.flatMap(r => r.tags).concat(getAllTags(f.subfolders)),
  );
  return uniq(allTags);
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
