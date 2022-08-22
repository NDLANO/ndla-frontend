/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useContext } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { breakpoints, mq, spacing } from '@ndla/core';
import { FolderType, TreeStructure } from '@ndla/ui';
import { Outlet, useLocation } from 'react-router-dom';
import { useFolder, useFolders } from './folderMutations';
import { createStaticStructureElements } from '../../util/folderHelpers';
import IsMobileContext from '../../IsMobileContext';

const StyledLayout = styled.div`
  display: grid;
  min-height: 60vh;
  margin-top: ${spacing.medium};
  grid-template-columns: minmax(300px, 1fr) minmax(auto, 1024px) minmax(
      0px,
      1fr
    );

  ${mq.range({ until: breakpoints.tabletWide })} {
    display: flex;
  }
`;

interface StyledContentProps {
  isMobile: boolean;
}

const StyledContent = styled.div<StyledContentProps>`
  max-width: 1024px;
  flex: 1;
  margin: 0 ${({ isMobile }) => (isMobile ? spacing.nsmall : spacing.large)};
`;

const StyledSideBar = styled.div`
  margin-left: auto;
  min-width: 300px;
  width: 300px;
  ${mq.range({ until: breakpoints.tabletWide })} {
    display: none;
  }
`;

const MyNdlaLayout = () => {
  const { folders } = useFolders();
  const { t } = useTranslation();
  const location = useLocation();
  const [page, folderId] = location.pathname
    .replace('/profile/', '')
    .split('/');
  const selectedFolder = useFolder(folderId);

  const isMobile = useContext(IsMobileContext);

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

  const staticStructureElements: FolderType[] = useMemo(
    () => createStaticStructureElements(folders, t),
    [folders, t],
  );

  return (
    <StyledLayout>
      <StyledSideBar>
        <TreeStructure
          folders={staticStructureElements}
          defaultOpenFolders={defaultSelected}
          openOnFolderClick
        />
      </StyledSideBar>
      <StyledContent isMobile={isMobile}>
        <Outlet />
      </StyledContent>
    </StyledLayout>
  );
};

export default MyNdlaLayout;
