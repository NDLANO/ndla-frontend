/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, useMemo, useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import styled from '@emotion/styled';
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
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';
import { colors, spacing } from '@ndla/core';
import { Spinner } from '@ndla/icons';
import { t } from 'i18next';
import { FolderOutlined } from '@ndla/icons/contentType';
import { BlockWrapper, FolderAction, ViewType } from './FoldersPage';
import WhileLoading from '../../../components/WhileLoading';
import NewFolder from '../../../components/MyNdla/NewFolder';
import { GQLFolder } from '../../../graphqlTypes';
import {
  FolderTotalCount,
  getTotalCountForFolder,
} from '../../../util/folderHelpers';
import { useSortFoldersMutation } from '../folderMutations';
import DraggableFolder from './DraggableFolder';
import { makeDndSortFunction, makeDndTranslations } from './util';

const StyledFolderIcon = styled.span`
  display: flex;
  padding: ${spacing.small};
  svg {
    color: ${colors.brand.primary};
    height: 20px;
    width: 20px;
  }
`;

interface Props {
  loading: boolean;
  type: ViewType;
  folders: GQLFolder[];
  isAdding: boolean;
  onFolderAdd: (folder: GQLFolder) => Promise<void>;
  folderId: string | undefined;
  setIsAdding: Dispatch<boolean>;
  setFolderAction: Dispatch<FolderAction | undefined>;
}

const FolderList = ({
  loading,
  type,
  folders,
  isAdding,
  setIsAdding,
  onFolderAdd,
  folderId,
  setFolderAction,
}: Props) => {
  const { sortFolders } = useSortFoldersMutation();
  const client = useApolloClient();
  const [sortedFolders, setSortedFolders] = useState(folders);

  useEffect(() => {
    setSortedFolders(folders);
  }, [folders]);

  const foldersCount = useMemo(
    () =>
      folders?.reduce<Record<string, FolderTotalCount>>((acc, curr) => {
        acc[curr.id] = getTotalCountForFolder(curr);
        return acc;
      }, {}),
    [folders],
  );

  const updateCache = (newOrder: string[]) => {
    const sortCacheModifierFunction = (
      existing: (GQLFolder & { __ref: string })[],
    ) => {
      return newOrder.map(id =>
        existing.find(ef => ef.__ref === `Folder:${id}`),
      );
    };

    if (folderId) {
      client.cache.modify({
        id: client.cache.identify({
          __ref: `Folder:${folderId}`,
        }),
        fields: { subfolders: sortCacheModifierFunction },
      });
    } else {
      client.cache.modify({
        fields: { folders: sortCacheModifierFunction },
      });
    }
  };

  const announcements = useMemo(
    () => makeDndTranslations('folder', t, folders.length),
    [folders],
  );

  const sortFolderIds = makeDndSortFunction(
    folderId,
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
    <WhileLoading isLoading={loading} fallback={<Spinner />}>
      {isAdding && (
        <NewFolder
          icon={
            <StyledFolderIcon>
              <FolderOutlined />
            </StyledFolderIcon>
          }
          parentId={folderId ?? 'folders'}
          onClose={() => setIsAdding(false)}
          onCreate={onFolderAdd}
        />
      )}
      {folders && (
        <BlockWrapper type={type}>
          {isAdding && (
            <NewFolder
              icon={
                <StyledFolderIcon>
                  <FolderOutlined />
                </StyledFolderIcon>
              }
              parentId={folderId ?? 'folders'}
              onClose={() => setIsAdding(false)}
              onCreate={onFolderAdd}
            />
          )}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={sortFolderIds}
            accessibility={{ announcements }}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
            <SortableContext
              items={sortedFolders}
              strategy={verticalListSortingStrategy}>
              {folders.map((folder, index) => (
                <DraggableFolder
                  key={`folder-${folder.id}`}
                  folder={folder}
                  index={index}
                  foldersCount={foldersCount}
                  type={type}
                  setFolderAction={setFolderAction}
                />
              ))}
            </SortableContext>
          </DndContext>
        </BlockWrapper>
      )}
    </WhileLoading>
  );
};
export default FolderList;
