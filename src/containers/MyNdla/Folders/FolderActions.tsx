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
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import concat from 'lodash/concat';
import { GQLFolder } from '../../../graphqlTypes';
import { copyFolderSharingLink, FolderActionType } from './FoldersPage';
import config from '../../../config';

interface Props {
  onActionChanged: (action: FolderActionType) => void;
  selectedFolder: GQLFolder | null;
}

const FolderActions = ({ onActionChanged, selectedFolder }: Props) => {
  const { t } = useTranslation();
  const { addSnack } = useSnack();
  const isShared = selectedFolder?.status === 'shared';
  const actionItems: MenuItemProps[] = useMemo(
    () =>
      concat(
        [
          {
            icon: <Pencil />,
            text: t('myNdla.folder.edit'),
            onClick: () => onActionChanged('edit'),
          },
        ],
        config.sharingEnabled
          ? isShared
            ? [
                {
                  icon: <Link />,
                  text: t('myNdla.folder.sharing.button.shareLink'),
                  onClick: () => {
                    copyFolderSharingLink(selectedFolder?.id ?? '');
                    addSnack({
                      id: 'shareLink',
                      content: t('myNdla.folder.sharing.link'),
                    });
                  },
                },
                {
                  icon: <Cross />,
                  text: t('myNdla.folder.sharing.button.unShare'),
                  onClick: () => onActionChanged('shared'),
                },
              ]
            : [
                {
                  icon: <Share />,
                  text: t('myNdla.folder.sharing.share'),
                  onClick: () => onActionChanged('private'),
                },
              ]
          : [],
        [
          {
            icon: <DeleteForever />,
            text: t('myNdla.folder.delete'),
            type: 'danger',
            onClick: () => onActionChanged('delete'),
          },
        ],
      ),
    [t, isShared, onActionChanged, selectedFolder?.id, addSnack],
  );

  return <MenuButton menuItems={actionItems} size="small" />;
};

export default FolderActions;
