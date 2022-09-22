/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MenuButton, MenuItemProps } from '@ndla/button';
import { Pencil } from '@ndla/icons/lib/action';
import { DeleteForever } from '@ndla/icons/lib/editor';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FolderActionType } from './FoldersPage';

interface Props {
  onActionChanged: (action: FolderActionType) => void;
}

const FolderActions = ({ onActionChanged }: Props) => {
  const { t } = useTranslation();
  const actionItems: MenuItemProps[] = useMemo(
    () => [
      {
        icon: <Pencil />,
        text: t('myNdla.folder.edit'),
        onClick: () => onActionChanged('edit'),
      },
      {
        icon: <DeleteForever />,
        text: t('myNdla.folder.delete'),
        type: 'danger',
        onClick: () => onActionChanged('delete'),
      },
    ],
    [t, onActionChanged],
  );

  return <MenuButton menuItems={actionItems} size="small" />;
};

export default FolderActions;
