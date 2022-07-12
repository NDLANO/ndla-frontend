/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useApolloClient } from '@apollo/client';
import { Pencil } from '@ndla/icons/action';
import { DeleteForever } from '@ndla/icons/editor';
import { ActionBreadcrumb } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { GQLBreadcrumb } from '../../../graphqlTypes';
import { getFolder } from '../folderMutations';
import { FolderAction } from './FoldersPage';

interface Props {
  breadcrumbs: GQLBreadcrumb[];
  onActionChanged: (action: FolderAction) => void;
}
const FolderBreadcrumb = ({ breadcrumbs, onActionChanged }: Props) => {
  const { t } = useTranslation();
  const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1]!;
  const { cache } = useApolloClient();

  return (
    <ActionBreadcrumb
      actionItems={[
        {
          icon: <Pencil />,
          text: t('myNdla.folder.edit'),
          onClick: () =>
            onActionChanged({
              action: 'edit',
              folder: getFolder(cache, lastBreadcrumb.id)!,
            }),
        },
        {
          icon: <DeleteForever />,
          text: t('myNdla.folder.delete'),
          onClick: () =>
            onActionChanged({
              action: 'delete',
              folder: getFolder(cache, lastBreadcrumb.id)!,
            }),
          type: 'danger',
        },
      ]}
      items={[
        { name: t('myNdla.myFolders'), to: '/minndla/folders' },
        ...breadcrumbs?.map(crumb => ({
          name: crumb.name,
          to: `/minndla/folders/${crumb.id}`,
        })),
      ]}
    />
  );
};

export default FolderBreadcrumb;
