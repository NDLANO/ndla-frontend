/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
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
`;

const MyNdlaLayout = () => {
  const { folders } = useFolders();
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
      name: 'Min Side',
      icon: <Person />,
      subfolders: [],
    },
    {
      id: 'folders',
      name: 'Mine Mapper',
      subfolders: folders,
    },
    {
      id: 'tags',
      name: 'Mine Tagger',
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
