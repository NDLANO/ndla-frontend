/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Cross, Pencil } from '@ndla/icons/action';
import { DeleteForever } from '@ndla/icons/editor';
import { Folder } from '@ndla/ui';
import { colors, spacing } from '@ndla/core';
import { Share } from '@ndla/icons/common';
import { GQLFolder } from '../../../graphqlTypes';
import { FolderTotalCount } from '../../../util/folderHelpers';
import { FolderAction, ViewType } from './FoldersPage';
import DragHandle from './DragHandle';
import { AuthContext } from '../../../components/AuthenticationContext';
import { isStudent } from './util';
import FolderMenu from '../components/FolderMenu';
import { MenuItemProps } from '../components/SettingsMenu';

interface Props {
  folder: GQLFolder;
  index: number;
  type: ViewType;
  foldersCount: Record<string, FolderTotalCount>;
  setFolderAction: (action: FolderAction | undefined) => void;
  onViewTypeChange: (type: ViewType) => void;
}

interface DraggableListItemProps {
  isDragging: boolean;
}

export const DraggableListItem = styled.li<DraggableListItemProps>`
  display: flex;
  position: relative;
  list-style: none;
  margin: 0;
  align-items: center;
  gap: ${spacing.xsmall};
  z-index: ${(p) => (p.isDragging ? '10' : '0')};
`;

export const DragWrapper = styled.div`
  max-width: 100%;
  background-color: ${colors.white};
  flex-grow: 1;
`;

const DraggableFolder = ({
  index,
  folder,
  type,
  foldersCount,
  setFolderAction,
  onViewTypeChange,
}: Props) => {
  const { examLock, user } = useContext(AuthContext);
  const { t } = useTranslation();
  const { attributes, setNodeRef, transform, transition, items, isDragging } =
    useSortable({
      id: folder.id,
      data: {
        name: folder.name,
        index: index + 1,
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const menuItems: MenuItemProps[] = useMemo(() => {
    if (examLock) return [];
    const editFolder: MenuItemProps = {
      icon: <Pencil />,
      text: t('myNdla.folder.edit'),
      onClick: () => setFolderAction({ action: 'edit', folder, index }),
    };

    const shareLink: MenuItemProps = {
      icon: <Share />,
      text: t('myNdla.folder.sharing.button.share'),
      onClick: () => {
        setFolderAction({
          action: 'shared',
          folder,
          index,
        });
      },
    };

    const unShare: MenuItemProps = {
      icon: <Cross />,
      text: t('myNdla.folder.sharing.button.unShare'),
      onClick: () =>
        setFolderAction({
          action: 'unShare',
          folder,
          index,
        }),
    };

    const share: MenuItemProps = {
      icon: <Share />,
      text: t('myNdla.folder.sharing.button.share'),
      onClick: () =>
        setFolderAction({
          action: 'private',
          folder,
          index,
        }),
    };

    const deleteOpt: MenuItemProps = {
      icon: <DeleteForever />,
      text: t('myNdla.folder.delete'),
      onClick: () =>
        setFolderAction({
          action: 'delete',
          folder,
          index,
        }),
      type: 'danger',
    };

    if (isStudent(user)) {
      return [editFolder, deleteOpt];
    }
    const sharedOptions =
      folder.status === 'shared' ? [shareLink, unShare] : [share];

    return [editFolder, sharedOptions, deleteOpt].flat();
  }, [examLock, folder, index, setFolderAction, t, user]);

  const menu = useMemo(
    () => (
      <FolderMenu
        menuItems={menuItems}
        viewType={type}
        onViewTypeChange={onViewTypeChange}
      />
    ),
    [menuItems, onViewTypeChange, type],
  );

  return (
    <DraggableListItem
      id={`folder-${folder.id}`}
      ref={setNodeRef}
      style={style}
      isDragging={isDragging}
    >
      <DragHandle
        sortableId={folder.id}
        disabled={type === 'block' || items.length < 2}
        name={folder.name}
        type="folder"
        {...attributes}
      />
      <DragWrapper>
        <Folder
          id={folder.id}
          isShared={folder.status === 'shared'}
          link={`/minndla/folders/${folder.id}`}
          title={folder.name}
          type={type}
          menu={menu}
          subFolders={foldersCount[folder.id]?.folders}
          subResources={foldersCount[folder.id]?.resources}
        />
      </DragWrapper>
    </DraggableListItem>
  );
};

export default memo(DraggableFolder);
