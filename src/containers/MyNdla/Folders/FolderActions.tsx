/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Cross, Pencil } from '@ndla/icons/action';
import { DeleteForever } from '@ndla/icons/editor';
import { Share } from '@ndla/icons/common';
import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GQLFolder } from '../../../graphqlTypes';
import { FolderActionType, ViewType } from './FoldersPage';
import { AuthContext } from '../../../components/AuthenticationContext';
import { isStudent } from './util';
import { MenuItemProps } from '../components/SettingsMenu';
import FolderMenu from '../components/FolderMenu';

interface Props {
  onActionChanged: (action: FolderActionType) => void;
  selectedFolder: GQLFolder | null;
  viewType: ViewType;
  onViewTypeChange: (type: ViewType) => void;
}

const FolderActions = ({
  onActionChanged,
  selectedFolder,
  viewType,
  onViewTypeChange,
}: Props) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const actionItems: MenuItemProps[] = useMemo(() => {
    const editFolder: MenuItemProps = {
      icon: <Pencil />,
      text: t('myNdla.folder.edit'),
      onClick: () => onActionChanged('edit'),
    };

    const shareLink: MenuItemProps = {
      icon: <Share />,
      text: t('myNdla.folder.sharing.button.share'),
      onClick: () => onActionChanged('shared'),
    };

    const unShare: MenuItemProps = {
      icon: <Cross />,
      text: t('myNdla.folder.sharing.button.unShare'),
      onClick: () => onActionChanged('unShare'),
    };

    const share: MenuItemProps = {
      icon: <Share />,
      text: t('myNdla.folder.sharing.share'),
      onClick: () => onActionChanged('private'),
    };
    const deleteOpt: MenuItemProps = {
      icon: <DeleteForever />,
      text: t('myNdla.folder.delete'),
      type: 'danger',
      onClick: () => onActionChanged('delete'),
    };

    if (isStudent(user)) {
      return [editFolder, deleteOpt];
    }

    const sharedOptions =
      selectedFolder?.status === 'shared' ? [shareLink, unShare] : [share];

    return [editFolder, sharedOptions, deleteOpt].flat();
  }, [onActionChanged, selectedFolder, t, user]);

  return (
    <FolderMenu
      menuItems={actionItems}
      viewType={viewType}
      onViewTypeChange={onViewTypeChange}
    />
  );
};

export default FolderActions;
