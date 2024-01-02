/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { breakpoints, mq, spacing } from '@ndla/core';
import Folder, { StyledUl } from './Folder';
import { GQLFolder, GQLFolderResourceMetaSearchQuery } from '../../../graphqlTypes';
import useArrowNavigation from '../../Masthead/drawer/useArrowNavigation';

interface Props {
  folder: GQLFolder;
  onClose?: () => void;
  meta: Record<string, GQLFolderResourceMetaSearchQuery['folderResourceMetaSearch'][0]>;
}

const RootUl = styled(StyledUl)`
  padding: ${spacing.small};
  padding-bottom: 0;
  ${mq.range({ until: breakpoints.tablet })} {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
`;

const FolderNavigation = ({ folder, meta, onClose }: Props) => {
  const { subfolderId, resourceId, folderId } = useParams();

  const defaultSelected = subfolderId && resourceId ? `shared-${subfolderId}-${resourceId}` : `shared-${folderId}`;

  const { setFocused } = useArrowNavigation(true, {
    multilevel: true,
    initialSelected: defaultSelected,
  });

  return (
    <nav>
      <RootUl role="tree" data-list>
        <Folder
          setFocus={setFocused}
          level={1}
          onClose={onClose}
          folder={folder}
          meta={meta}
          defaultOpenFolder={subfolderId!}
          root
        />
      </RootUl>
    </nav>
  );
};

export default FolderNavigation;
