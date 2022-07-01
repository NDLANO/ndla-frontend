/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GQLFolder, GQLFolderResource } from '../graphqlTypes';

type PartitionableResource = Pick<GQLFolderResource, 'path'>;
type PartitionableFolder = Pick<GQLFolder, 'breadcrumbs'>;
const isResource = <
  TResource extends PartitionableResource,
  TFolder extends PartitionableFolder
>(
  val: TFolder | TResource,
): val is TResource => 'path' in val;

interface PartitionedFolderData<
  TResource extends PartitionableResource,
  TFolder extends PartitionableFolder
> {
  folders: TFolder[];
  resources: TResource[];
}

export const partitionFolderData = <
  TResource extends PartitionableResource,
  TFolder extends PartitionableFolder
>(
  data: (TFolder | TResource)[],
): PartitionedFolderData<TResource, TFolder> => {
  return data.reduce<PartitionedFolderData<TResource, TFolder>>(
    (acc, curr) => {
      if (isResource(curr)) {
        acc.resources = acc.resources.concat(curr);
      } else {
        acc.folders = acc.folders.concat(curr);
      }
      return acc;
    },
    { folders: [], resources: [] },
  );
};
