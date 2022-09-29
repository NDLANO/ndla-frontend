/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MakeDNDList } from '@ndla/ui';
import { DropResult } from 'react-beautiful-dnd';
import { useApolloClient } from '@apollo/client';
import { GQLFolder } from '../../../graphqlTypes';
import { FolderTotalCount } from '../../../util/folderHelpers';
import { FolderAction, ViewType } from './FoldersPage';
import { useSortFoldersMutation } from '../folderMutations';
import DraggableFolder from './DraggableFolder';
import { moveIndexToNewIndex } from './util';

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

  async function sortFolderIds(
    dropResult: DropResult,
    parentId: string | undefined,
  ) {
    const sourceIdx = dropResult.source.index;
    const destinationIdx = dropResult.destination?.index;
    if (destinationIdx === undefined) return;

    const originalIds = folders.map(f => f.id);
    const sortedIds = moveIndexToNewIndex(
      originalIds,
      sourceIdx,
      destinationIdx,
    );
    if (sortedIds === null) return;

    const updateCache = (newOrder: string[]) => {
      const sortCacheModifierFunction = (
        existing: (GQLFolder & { __ref: string })[],
      ) => {
        return newOrder.map(id =>
          existing.find(ef => ef.__ref === `Folder:${id}`),
        );
      };

      if (parentId) {
        client.cache.modify({
          id: client.cache.identify({
            __ref: `Folder:${parentId}`,
          }),
          fields: { subfolders: sortCacheModifierFunction },
        });
      } else {
        client.cache.modify({
          fields: { folders: sortCacheModifierFunction },
        });
      }
    };

    // Update cache before sorting happens to make gui feel snappy
    updateCache(sortedIds);

    return sortFolders({
      variables: {
        sortedIds,
        parentId,
      },
    }).catch(() => updateCache(originalIds));
  }

  return (
    <MakeDNDList
      disableDND={type === 'block'}
      onDragEnd={result => sortFolderIds(result, currentFolderId)}
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
