/*
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { HashTag, Person } from '@ndla/icons/common';
import { FolderType, TreeStructure } from '@ndla/ui';
import IsMobileContext from '../../IsMobileContext';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

const MenuPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${spacing.small};
`;

const MyNdlaMenuPage = () => {
  const { t } = useTranslation();
  const isMobile = useContext(IsMobileContext);

  if (!isMobile) {
    return <NotFoundPage />;
  }
  const staticFolderElements: FolderType[] = [
    {
      id: '',
      name: t('myNdla.myPage.myPage'),
      status: 'private',
      isFavorite: false,
      icon: <Person />,
      breadcrumbs: [],
      subfolders: [],
      resources: [],
    },
    {
      id: 'folders',
      name: t('myNdla.myFolders'),
      status: 'private',
      isFavorite: false,
      breadcrumbs: [],
      subfolders: [],
      resources: [],
    },
    {
      icon: <HashTag />,
      id: 'tags',
      name: t('myNdla.myTags'),
      status: 'private',
      isFavorite: false,
      breadcrumbs: [],
      subfolders: [],
      resources: [],
    },
  ];

  return (
    <MenuPageContainer>
      <h1>{t('myNdla.myNDLA')}</h1>
      <TreeStructure folders={staticFolderElements} />
    </MenuPageContainer>
  );
};

export default MyNdlaMenuPage;
