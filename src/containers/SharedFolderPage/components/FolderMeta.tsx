/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { breakpoints, mq } from '@ndla/core';
import { Copy } from '@ndla/icons/action';
import { InformationOutline } from '@ndla/icons/common';
import { HelmetWithTracker } from '@ndla/tracker';
import { MessageBox, OneColumn } from '@ndla/ui';
import CopyFolderModal from '../../../components/MyNdla/CopyFolderModal';
import { GQLFolder } from '../../../graphqlTypes';
import ErrorPage from '../../ErrorPage';

interface Props {
  folder: GQLFolder | null;
  title: string;
}

const StyledOneColumn = styled(OneColumn)`
  ${mq.range({ from: breakpoints.tablet })} {
    padding-bottom: 200px;
  }
`;

const StyledDescription = styled.p`
  white-space: pre-wrap;
`;

const FolderMeta = ({ folder, title }: Props) => {
  const { t } = useTranslation();
  if (!folder) {
    return <ErrorPage />;
  }

  return (
    <main>
      <StyledOneColumn>
        {folder.status !== 'shared' ? (
          <MessageBox>
            <InformationOutline ariaHidden />
            {t('myNdla.folder.sharing.previewInformation')}
          </MessageBox>
        ) : null}
        <HelmetWithTracker title={t('htmlTitles.sharedFolderPage', { name: title })} />
        <h1>{folder.name}</h1>
        <StyledDescription>{folder.description || t('myNdla.sharedFolder.description.all')}</StyledDescription>

        <CopyFolderModal folder={folder}>
          <ButtonV2 colorTheme="light">
            <Copy />
            {t('myNdla.folder.copy')}
          </ButtonV2>
        </CopyFolderModal>
      </StyledOneColumn>
    </main>
  );
};

export default FolderMeta;
