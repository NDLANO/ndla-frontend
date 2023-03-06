/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { breakpoints, mq, spacing } from '@ndla/core';
import { Spinner } from '@ndla/icons';
import { useParams } from 'react-router-dom';
import {
  GQLFolder,
  GQLFolderResourceMetaSearchQuery,
} from '../../../graphqlTypes';
import useArrowNavigation from '../../Masthead/drawer/useArrowNavigation';
import Folder, { StyledUl } from './Folder';

interface Props {
  folder?: GQLFolder;
  loading: boolean;
  onClose?: () => void;
  meta: Record<
    string,
    GQLFolderResourceMetaSearchQuery['folderResourceMetaSearch'][0]
  >;
}

const StyledNav = styled.nav`
  ${mq.range({ until: breakpoints.tablet })} {
    display: flex;
    overflow-y: scroll;
  }
`;

const RootUl = styled(StyledUl)`
  padding: ${spacing.small};
  padding-bottom: 0;
  ${mq.range({ until: breakpoints.tablet })} {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: scroll;
  }
`;

const FolderNavigation = ({ folder, meta, loading, onClose }: Props) => {
  const { subfolderId, resourceId, folderId } = useParams();

  const defaultSelected =
    subfolderId && resourceId
      ? `shared-${subfolderId}-${resourceId}`
      : `shared-${folderId}`;

  useArrowNavigation(!!(!loading && folder), {
    multilevel: true,
    initialSelected: defaultSelected,
  });

  if (loading) {
    return <Spinner />;
  }

  if (!folder) {
    return <div>error</div>;
  }

  return (
    <StyledNav>
      <RootUl role="tree" data-list>
        <Folder
          level={1}
          onClose={onClose}
          folder={folder}
          meta={meta}
          defaultOpenFolder={subfolderId!}
          root
        />
      </RootUl>
    </StyledNav>
  );
};

export default FolderNavigation;
