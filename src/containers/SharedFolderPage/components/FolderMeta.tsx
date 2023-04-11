/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { breakpoints, mq } from '@ndla/core';
import { OneColumn } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { GQLFolder } from '../../../graphqlTypes';
import ErrorPage from '../../ErrorPage';

interface Props {
  folder?: GQLFolder;
}

const StyledOneColumn = styled(OneColumn)`
  ${mq.range({ from: breakpoints.tablet })} {
    padding-bottom: 200px;
  }
`;

const FolderMeta = ({ folder }: Props) => {
  const { t } = useTranslation();
  if (!folder) {
    return <ErrorPage />;
  }

  return (
    <StyledOneColumn>
      <h1>{folder.name}</h1>
      <p>{t('myNdla.sharedFolder.description.info1')}</p>
      <p>{t('myNdla.sharedFolder.description.info2')}</p>
      <p>{t('myNdla.sharedFolder.description.info3')}</p>
    </StyledOneColumn>
  );
};

export default FolderMeta;
