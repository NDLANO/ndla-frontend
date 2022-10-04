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
import { DeleteForever, DragVertical } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GQLFolder } from '../../../graphqlTypes';
import { FolderTotalCount } from '../../../util/folderHelpers';
import { FolderAction, ViewType } from './FoldersPage';

interface DraggableFolderProps {
  id: string;
  type: ViewType;
  folder: GQLFolder;
  foldersCount: Record<string, FolderTotalCount>;
  setFolderAction: (action: FolderAction | undefined) => void;
  index: number;
}

export const DraggableListItem = styled.li`
  list-style: none;
  margin: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${spacing.xsmall};
`;

export const DragWrapper = styled.div`
  flex-grow: 1;
`;

export const DragButton = ({ folderId }: { folderId: string }) => {
  const { listeners, setActivatorNodeRef } = useSortable({ id: folderId });
  return (
    <div {...listeners} ref={setActivatorNodeRef}>
      <IconButtonV2
        aria-label={'TODO'}
        type={'button'}
        variant={'ghost'}
        colorTheme={'light'}
        size={'small'}>
        <DragVertical />
      </IconButtonV2>
    </div>
  );
};

const DraggableFolder = ({
  index,
  type,
  foldersCount,
  setFolderAction,
  folder,
}: DraggableFolderProps) => {
  const { t } = useTranslation();
  const { attributes, setNodeRef, transform, transition } = useSortable({
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
      {...attributes}>
      <DragButton folderId={folder.id} />
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
