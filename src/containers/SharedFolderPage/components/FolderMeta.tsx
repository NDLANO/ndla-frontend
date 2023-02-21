/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
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

const Container = styled(OneColumn)`
  margin-top: ${spacing.large};
`;

const FolderMeta = ({ folder, loading }: Props) => {
  const { t } = useTranslation();
  if (loading) {
    return <Spinner />;
  }
  if (!folder) {
    return <ErrorPage />;
  }

  return (
    <Container>
      <h1>{folder.name}</h1>
      <FolderAndResourceCount
        selectedFolder={folder}
        hasSelectedFolder={true}
        folders={folder.subfolders}
        folderData={folder.subfolders}
        loading={false}
      />
      {/* TODO: Add translation in packages */}
      {t('myNdla.sharedFolder.infoDetailed')}
    </Container>
  );
};

export default FolderMeta;
