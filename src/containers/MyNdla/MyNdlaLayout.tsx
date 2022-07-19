/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { breakpoints, colors, mq, spacing } from '@ndla/core';
import { HashTag, Person } from '@ndla/icons/common';
import { FolderType, TreeStructure } from '@ndla/ui';
import { Outlet, useLocation } from 'react-router-dom';
import { useFolder, useFolders } from './folderMutations';

const StyledLayout = styled.div`
  display: flex;
`;

const StyledSideBar = styled.div`
  padding-left: ${spacing.large};
  border-right: 1px solid ${colors.brand.greyLighter};
  width: 300px;
  ${mq.range({ until: breakpoints.tablet })} {
    display: none;
  }
`;

const MyNdlaLayout = () => {
  const { folders } = useFolders();
  const { t } = useTranslation();
  const location = useLocation();
  const [page, folderId] = location.pathname
    .replace('/minndla/', '')
    .split('/');
  const selectedFolder = useFolder(folderId);

  const defaultSelected = useMemo(() => {
    if (typeof page === 'string') {
      if (folderId) {
        return [page].concat(
          selectedFolder ? selectedFolder.breadcrumbs.map(b => b.id) : [],
        );
      }
      return [page];
    }
    return [];
  }, [selectedFolder, folderId, page]);

  const staticStructureElements: FolderType[] = [
    {
      id: '',
      isFavorite: false,
      name: t('myNdla.myPage.myPage'),
      icon: <Person />,
      status: 'private',
      subfolders: [],
      breadcrumbs: [],
      resources: [],
    },
    {
      id: 'folders',
      isFavorite: false,
      name: t('myNdla.myFolders'),
      status: 'private',
      subfolders: folders,
      breadcrumbs: [],
      resources: [],
    },
    {
      id: 'tags',
      icon: <HashTag />,
      isFavorite: false,
      name: t('myNdla.myTags'),
      status: 'private',
      subfolders: [],
      breadcrumbs: [],
      resources: [],
    },
  ];
  return (
    <StyledLayout>
      <StyledSideBar>
        <TreeStructure
          folders={staticStructureElements}
          defaultOpenFolders={defaultSelected}
          openOnFolderClick
        />
      </StyledSideBar>
      <Outlet />
    </StyledLayout>
  );
};

export default MyNdlaLayout;
