/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { SafeLinkButton } from '@ndla/safelink';
import { ContentTypeBadge } from '@ndla/ui';
import { useParams } from 'react-router-dom';
import {
  GQLFolderResource,
  GQLFolderResourceMetaSearchQuery,
} from '../../../graphqlTypes';
import { contentTypeMapping } from '../../../util/getContentType';
import { StyledLi } from './Folder';

interface StyledProps {
  current: boolean;
}

const shouldForwardProp = (prop: string) => !['current'].includes(prop);
const styledOptions = { shouldForwardProp };

const StyledSafelinkButton = styled(SafeLinkButton, styledOptions)<StyledProps>`
  text-align: left;
  align-items: flex-start;
  color: ${({ current }) => (current ? colors.white : colors.black)};
`;

const StyledContentBadge = styled(ContentTypeBadge)<StyledProps>`
  svg {
    color: ${({ current }) =>
      current ? colors.white : colors.black} !important;
  }

  width: 26px;
  height: 26px;

  a:hover &,
  a:focus & {
    svg {
      color: ${colors.white} !important;
    }
  }
`;

interface Props {
  parentId: string;
  meta?: GQLFolderResourceMetaSearchQuery['folderResourceMetaSearch'][0];
  resource: GQLFolderResource;
}

const FolderResource = ({ parentId, resource, meta }: Props) => {
  const { folderId: rootFolderId, subfolderId, resourceId } = useParams();

  const isCurrent = resource.id === resourceId && parentId === subfolderId;

  const contentType =
    contentTypeMapping[meta?.resourceTypes?.[0]?.id || 'default'];

  return (
    <StyledLi role="none" data-list-item>
      <StyledSafelinkButton
        current={isCurrent}
        aria-current={isCurrent ? 'page' : undefined}
        tabIndex={-1}
        id={`shared-${parentId}-${resource.id}`}
        role="treeitem"
        variant={isCurrent ? 'solid' : 'ghost'}
        to={`/folder/${rootFolderId}/${parentId}/${resource.id}`}>
        <StyledContentBadge
          current={isCurrent}
          type={contentType!}
          border={false}
        />
        {meta?.title}
      </StyledSafelinkButton>
    </StyledLi>
  );
};

export default FolderResource;
