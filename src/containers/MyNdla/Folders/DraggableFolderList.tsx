/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Folder, MakeDNDList } from '@ndla/ui';
import { Pencil } from '@ndla/icons/action';
import { useTranslation } from 'react-i18next';
import { DeleteForever } from '@ndla/icons/editor';
import {
  DraggableProvidedDragHandleProps,
  DropResult,
} from 'react-beautiful-dnd';
import { useApolloClient } from '@apollo/client';
import { GQLFolder } from '../../../graphqlTypes';
import { FolderTotalCount } from '../../../util/folderHelpers';
import { FolderAction, ListItem, ViewType } from './FoldersPage';
import { useSortFoldersMutation } from '../folderMutations';

interface Props {
  currentFolderId: string | undefined;
  type: ViewType;
  folders: GQLFolder[];
  foldersCount: Record<string, FolderTotalCount>;
  setFolderAction: (action: FolderAction | undefined) => void;
}
interface DraggableFolderProps {
  id: string;
  type: ViewType;
  folder: GQLFolder;
  foldersCount: Record<string, FolderTotalCount>;
  setFolderAction: (action: FolderAction | undefined) => void;
  index: number;
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

const DraggableFolder = ({
  index,
  type,
  foldersCount,
  setFolderAction,
  folder,
  dragHandleProps,
}: DraggableFolderProps) => {
  const { t } = useTranslation();
  return (
    <ListItem
      key={`folder-${folder.id}`}
      id={`folder-${folder.id}`}
      tabIndex={-1}
      {...dragHandleProps}>
      <Folder
        key={folder.id}
        id={folder.id}
        link={`/minndla/folders/${folder.id}`}
        title={folder.name}
        type={type === 'block' ? 'block' : 'list'}
        subFolders={foldersCount[folder.id]?.folders}
        subResources={foldersCount[folder.id]?.resources}
        menuItems={[
          {
            icon: <Pencil />,
            text: t('myNdla.folder.edit'),
            onClick: () => setFolderAction({ action: 'edit', folder, index }),
          },
          {
            icon: <DeleteForever />,
            text: t('myNdla.folder.delete'),
            onClick: () => setFolderAction({ action: 'delete', folder, index }),
            type: 'danger',
          },
        ]}
      />
    </ListItem>
  );
};

const moveIndexToNewIndex = <T,>(
  array: T[],
  oldIdx: number,
  newIdx: number,
): T[] | null => {
  const copy = [...array];
  const toMove = copy[oldIdx];
  if (!toMove) return null;

  copy.splice(oldIdx, 1); // Remove moved item from list
  copy.splice(newIdx, 0, toMove); // Insert removed item to new location
  return copy;
};

const DraggableFolderList = ({
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
    const ids = moveIndexToNewIndex(originalIds, sourceIdx, destinationIdx);
    if (ids === null) return;

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

    updateCache(ids);

    return sortFolders({
      variables: {
        sortedIds: ids,
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

export default DraggableFolderList;
