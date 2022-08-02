/*
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { FolderType, TreeStructure } from '@ndla/ui';
import IsMobileContext from '../../IsMobileContext';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { createStaticStructureElements } from '../../util/folderHelpers';

const MenuPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${spacing.small};
`;

const MyNdlaMobileMenuPage = () => {
  const { t } = useTranslation();
  const isMobile = useContext(IsMobileContext);

  const staticFolderElements: FolderType[] = useMemo(
    () => createStaticStructureElements([], t),
    [t],
  );

  if (!isMobile) {
    return <NotFoundPage />;
  }

  return (
    <MenuPageContainer>
      <h1>{t('myNdla.myNDLA')}</h1>
      <TreeStructure folders={staticFolderElements} />
    </MenuPageContainer>
  );
};

export default MyNdlaMobileMenuPage;
