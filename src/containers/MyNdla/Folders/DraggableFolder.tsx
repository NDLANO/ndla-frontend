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
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { GQLFolder } from '../../../graphqlTypes';
import { FolderTotalCount } from '../../../util/folderHelpers';
import { FolderAction, ViewType } from './FoldersPage';
import { IconButtonV2 } from '@ndla/button';
import styled from '@emotion/styled';

interface DraggableFolderProps {
  id: string;
  type: ViewType;
  folder: GQLFolder;
  foldersCount: Record<string, FolderTotalCount>;
  setFolderAction: (action: FolderAction | undefined) => void;
  index: number;
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

const DragButton = styled(IconButtonV2)``;

const ListItem = styled.li`
  list-style: none;
  margin: 0;
  display: flex;
  flex-direction: row;
`;

const FolderWrapper = styled.div`
  flex-grow: 1;
`;

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
      tabIndex={-1}>
      <DragButton
        {...dragHandleProps}
        aria-label={'TODO'}
        type={'button'}
        variant={'ghost'}
        colorTheme={'light'}
        size={'small'}>
        <DragVertical />
      </DragButton>
      <FolderWrapper>
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
      </FolderWrapper>
    </ListItem>
  );
};

export default DraggableFolder;
