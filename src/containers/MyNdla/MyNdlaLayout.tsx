/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { breakpoints, colors, mq, spacing } from '@ndla/core';
import { Person } from '@ndla/icons/common';
import { FolderStructureProps, TreeStructure } from '@ndla/ui';
import { Outlet, useLocation } from 'react-router-dom';
import { useFolder, useFolders } from './folderMutations';

const StyledLayout = styled.div`
  display: flex;
`;

const StyledSideBar = styled.div`
  padding-left: ${spacing.large};
  border-right: 1px solid ${colors.brand.greyLighter};
  max-width: 300px;
  min-width: 300px;
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
  const defaultSelected =
    page && folderId
      ? [page].concat(
          selectedFolder ? selectedFolder.breadcrumbs.map(b => b.id) : [],
        )
      : [];
  const staticStructureElements: FolderStructureProps[] = [
    {
      id: '',
      name: t('myNdla.myPage.myPage'),
      icon: <Person />,
      subfolders: [],
    },
    {
      id: 'folders',
      name: t('myNdla.myFolders'),
      subfolders: folders,
    },
    {
      id: 'tags',
      name: t('myNdla.myTags'),
      subfolders: [],
    },
  ];
  return (
    <StyledLayout>
      <StyledSideBar>
        <TreeStructure
          label=""
          folders={staticStructureElements}
          onNewFolder={async () => ''}
          defaultOpenFolders={defaultSelected}
          openOnFolderClick
        />
      </StyledSideBar>
      <Outlet />
    </StyledLayout>
  );
};

export default MyNdlaLayout;
