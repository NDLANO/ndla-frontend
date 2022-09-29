/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MakeDNDList } from '@ndla/ui';
import { useApolloClient } from '@apollo/client';
import { GQLFolder } from '../../../graphqlTypes';
import { FolderTotalCount } from '../../../util/folderHelpers';
import { FolderAction, ViewType } from './FoldersPage';
import { useSortFoldersMutation } from '../folderMutations';
import DraggableFolder from './DraggableFolder';
import { makeDndSortFunction } from './util';

interface Props {
  currentFolderId: string | undefined;
  type: ViewType;
  folders: GQLFolder[];
  foldersCount: Record<string, FolderTotalCount>;
  setFolderAction: (action: FolderAction | undefined) => void;
}

const FolderList = ({
  currentFolderId,
  type,
  folders,
  foldersCount,
  setFolderAction,
}: Props) => {
  const { sortFolders } = useSortFoldersMutation();
  const client = useApolloClient();

  const updateCache = (newOrder: string[]) => {
    const sortCacheModifierFunction = (
      existing: (GQLFolder & { __ref: string })[],
    ) => {
      return newOrder.map(id =>
        existing.find(ef => ef.__ref === `Folder:${id}`),
      );
    };

    if (currentFolderId) {
      client.cache.modify({
        id: client.cache.identify({
          __ref: `Folder:${currentFolderId}`,
        }),
        fields: { subfolders: sortCacheModifierFunction },
      });
    } else {
      client.cache.modify({
        fields: { folders: sortCacheModifierFunction },
      });
    }
  };

  const sortFolderIds = makeDndSortFunction(
    currentFolderId,
    folders,
    sortFolders,
    updateCache,
  );

  return (
    <MakeDNDList
      disableDND={type === 'block'}
      onDragEnd={result => sortFolderIds(result)}
      dragHandle={true}
      dndContextId={'folder-dnd'}>
      {folders.map((folder, index) => (
        <DraggableFolder
          id={folder.id}
          key={folder.id}
          index={index}
          folder={folder}
          foldersCount={foldersCount}
          setFolderAction={setFolderAction}
          type={type}
        />
      ))}
    </MakeDNDList>
  );
};

export default FolderList;
