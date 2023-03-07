/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Spinner } from '@ndla/icons';
import { OneColumn } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { GQLFolder } from '../../../graphqlTypes';
import ErrorPage from '../../ErrorPage';
import FolderAndResourceCount from '../../MyNdla/Folders/FolderAndResourceCount';

interface Props {
  folder?: GQLFolder;
  loading?: boolean;
}

const FolderMeta = ({ folder, loading }: Props) => {
  const { t } = useTranslation();
  if (loading) {
    return <Spinner />;
  }
  if (!folder) {
    return <ErrorPage />;
  }

  return (
    <OneColumn>
      <h1>{folder.name}</h1>
      <FolderAndResourceCount
        selectedFolder={folder}
        hasSelectedFolder={true}
        folders={folder.subfolders}
        folderData={folder.subfolders}
        loading={false}
      />
      <p>{t('myNdla.sharedFolder.description.info1')}</p>
      <p>{t('myNdla.sharedFolder.description.info2')}</p>
      <p>{t('myNdla.sharedFolder.description.info3')}</p>
    </OneColumn>
  );
};

export default FolderMeta;
