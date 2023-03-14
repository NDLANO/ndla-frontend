/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MenuButton, MenuItemProps } from '@ndla/button';
import { Cross, Pencil } from '@ndla/icons/action';
import { DeleteForever, Link } from '@ndla/icons/editor';
import { Share } from '@ndla/icons/lib/common';
import { useSnack } from '@ndla/ui';
import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GQLFolder } from '../../../graphqlTypes';
import { FolderActionType } from './FoldersPage';
import config from '../../../config';
import { AuthContext } from '../../../components/AuthenticationContext';
import { copyFolderSharingLink, isStudent } from './util';

interface Props {
  onActionChanged: (action: FolderActionType) => void;
  selectedFolder: GQLFolder | null;
}

const FolderActions = ({ onActionChanged, selectedFolder }: Props) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { addSnack } = useSnack();
  const actionItems: MenuItemProps[] = useMemo(() => {
    const editFolder: MenuItemProps = {
      icon: <Pencil />,
      text: t('myNdla.folder.edit'),
      onClick: () => onActionChanged('edit'),
    };

    const shareLink: MenuItemProps = {
      icon: <Link />,
      text: t('myNdla.folder.sharing.button.shareLink'),
      onClick: () => {
        copyFolderSharingLink(selectedFolder?.id ?? '');
        addSnack({
          id: 'shareLink',
          content: t('myNdla.folder.sharing.link'),
        });
      },
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

    if (!config.sharingEnabled || isStudent(user)) {
      return [editFolder, deleteOpt];
    }

    const sharedOptions =
      selectedFolder?.status === 'shared' ? [shareLink, unShare] : [share];

    return [editFolder, sharedOptions, deleteOpt].flat();
  }, [addSnack, onActionChanged, selectedFolder, t, user]);

  return <MenuButton menuItems={actionItems} size="small" />;
};

export default FolderActions;
