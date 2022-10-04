/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useApolloClient } from '@apollo/client';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
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
  const [sortedFolders, setSortedFolders] = useState(folders);

  useEffect(() => {
    setSortedFolders(folders);
  }, [folders]);

  const sortFolderIds = makeDndSortFunction(
    currentFolderId,
    folders,
    sortFolders,
    updateCache,
    setSortedFolders,
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={sortFolderIds}>
      <SortableContext
        items={sortedFolders}
        strategy={verticalListSortingStrategy}>
        {sortedFolders.map((folder, index) => (
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
      </SortableContext>
    </DndContext>
  );
};

export default FolderList;
