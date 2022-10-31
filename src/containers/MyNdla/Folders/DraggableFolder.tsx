/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pencil } from '@ndla/icons/action';
import { DeleteForever } from '@ndla/icons/editor';
import { Folder } from '@ndla/ui';
import { colors, spacing } from '@ndla/core';
import { GQLFolder } from '../../../graphqlTypes';
import { FolderTotalCount } from '../../../util/folderHelpers';
import { FolderAction, ViewType } from './FoldersPage';
import DragHandle from './DragHandle';

interface Props {
  folder: GQLFolder;
  index: number;
  type: ViewType;
  foldersCount: Record<string, FolderTotalCount>;
  setFolderAction: (action: FolderAction | undefined) => void;
}

interface DraggableListItemProps {
  isDragging: boolean;
}

export const DraggableListItem = styled.li<DraggableListItemProps>`
  display: flex;
  list-style: none;
  margin: 0;
  align-items: center;
  gap: ${spacing.xsmall};
  z-index: ${p => (p.isDragging ? '10' : '0')};
`;

export const DragWrapper = styled.div`
  background-color: ${colors.white};
  flex-grow: 1;
`;

const DraggableFolder = ({
  index,
  folder,
  type,
  foldersCount,
  setFolderAction,
}: Props) => {
  const { t } = useTranslation();
  const {
    attributes,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: folder.id,
    data: {
      name: folder.name,
      index,
    },
    attributes: {
      tabIndex: -1,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <DraggableListItem
      id={`folder-${folder.id}`}
      ref={setNodeRef}
      style={style}
      isDragging={isDragging}>
      {type !== 'block' && (
        <DragHandle
          sortableId={folder.id}
          name={folder.name}
          type="folder"
          {...attributes}
        />
      )}
      <DragWrapper>
        <Folder
          id={folder.id}
          link={`/minndla/folders/${folder.id}`}
          title={folder.name}
          type={type}
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
              onClick: () =>
                setFolderAction({ action: 'delete', folder, index }),
              type: 'danger',
            },
          ]}
        />
      </DragWrapper>
    </DraggableListItem>
  );
};

export default memo(DraggableFolder);
