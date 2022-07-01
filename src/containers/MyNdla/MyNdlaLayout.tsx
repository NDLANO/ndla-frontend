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
import { Outlet } from 'react-router-dom';

const StyledLayout = styled.div`
  display: flex;
`;

const StyledSideBar = styled.div`
  padding-left: ${spacing.large};
  border-right: 1px solid ${colors.brand.greyLighter};
  max-width: 300px;
  min-width: 300px;
`;

const staticStructureElements: FolderStructureProps[] = [
  {
    id: 'myNdla',
    name: 'Min Side',
    url: '/minndla',
    icon: <Person />,
    data: [],
  },
  {
    id: 'myFolders',
    name: 'Mine Mapper',
    url: '/minndla/folders',
    data: [],
  },
  {
    id: 'myTags',
    name: 'Mine Tagger',
    url: '/minndla/tags',
    data: [],
  },
];

const MyNdlaLayout = () => {
  return (
    <StyledLayout>
      <StyledSideBar>
        <TreeStructure
          label=""
          data={staticStructureElements}
          onNewFolder={async () => ''}
        />
      </StyledSideBar>
      <Outlet />
    </StyledLayout>
  );
};

export default MyNdlaLayout;
