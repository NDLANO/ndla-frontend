/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Folder } from '@ndla/ui';
import { Pencil } from '@ndla/icons/action';
import { useTranslation } from 'react-i18next';
import { DeleteForever } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { css } from '@emotion/core';
import { GQLFolder } from '../../../graphqlTypes';
import { FolderTotalCount } from '../../../util/folderHelpers';
import { FolderAction, ViewType } from './FoldersPage';
import { DragHandle } from './DragHandle';

interface DraggableFolderProps {
  id: string;
  type: ViewType;
  folder: GQLFolder;
  foldersCount: Record<string, FolderTotalCount>;
  setFolderAction: (action: FolderAction | undefined) => void;
  index: number;
}

interface LiProps {
  isDragging: boolean;
}

export const DraggableListItem = styled.li<LiProps>`
  list-style: none;
  margin: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${spacing.xsmall};
  ${p => {
    if (p.isDragging) {
      return css`
        z-index: 10;
      `;
    }
    return '';
  }}
`;

export const DragWrapper = styled.div`
  background-color: ${colors.white};
  flex-grow: 1;
`;

const DraggableFolder = ({
  index,
  type,
  foldersCount,
  setFolderAction,
  folder,
}: DraggableFolderProps) => {
  const { t } = useTranslation();
  const {
    attributes,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: folder.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <DraggableListItem
      key={`folder-${folder.id}`}
      id={`folder-${folder.id}`}
      ref={setNodeRef}
      style={style}
      isDragging={isDragging}
      {...attributes}>
      {type !== 'block' && <DragHandle sortableId={folder.id} />}
      <DragWrapper>
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

export default DraggableFolder;
