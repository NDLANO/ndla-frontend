/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { SafeLinkButton } from '@ndla/safelink';
import { ContentTypeBadge } from '@ndla/ui';
import { MouseEvent, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  GQLFolderResource,
  GQLFolderResourceMetaSearchQuery,
} from '../../../graphqlTypes';
import { contentTypeMapping } from '../../../util/getContentType';

interface StyledProps {
  current: boolean;
  level: number;
}

const shouldForwardProp = (prop: string) =>
  !['current', 'level'].includes(prop);
const styledOptions = { shouldForwardProp };

const StyledSafelinkButton = styled(SafeLinkButton, styledOptions)<StyledProps>`
  text-align: left;
  align-items: flex-start;
  margin-left: calc(${p => p.level} * ${spacing.small});
  color: ${({ current }) => (current ? colors.white : colors.black)};
`;

interface ContentBadgeProps {
  current: boolean;
}

const forwardContentBadge = (p: string) => p !== 'current';
const badgeOptions = { shouldForwardProp: forwardContentBadge };

const ContentBadge = styled(ContentTypeBadge, badgeOptions)<ContentBadgeProps>`
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

const ListElement = styled.li`
  margin: 0;
  padding: ${spacing.xxsmall} 0;
`;

interface Props {
  parentId: string;
  meta?: GQLFolderResourceMetaSearchQuery['folderResourceMetaSearch'][0];
  resource: GQLFolderResource;
  onClose?: () => void;
  level: number;
}

const FolderResource = ({
  parentId,
  resource,
  meta,
  level,
  onClose,
}: Props) => {
  const { folderId: rootFolderId, subfolderId, resourceId } = useParams();
  const navigate = useNavigate();
  const link = useMemo(
    () => `/folder/${rootFolderId}/${parentId}/${resource.id}`,
    [parentId, resource.id, rootFolderId],
  );

  const onClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      navigate(link);
      onClose?.();
    },
    [navigate, onClose, link],
  );

  const isCurrent = resource.id === resourceId && parentId === subfolderId;

  const contentType =
    contentTypeMapping[meta?.resourceTypes?.[0]?.id || 'default'];

  return (
    <ListElement role="none" data-list-item>
      <StyledSafelinkButton
        current={isCurrent}
        aria-current={isCurrent ? 'page' : undefined}
        tabIndex={-1}
        level={level}
        id={`shared-${parentId}-${resource.id}`}
        role="treeitem"
        onClick={onClick}
        variant={isCurrent ? 'solid' : 'ghost'}
        to={`/folder/${rootFolderId}/${parentId}/${resource.id}`}>
        <ContentBadge current={isCurrent} type={contentType!} border={false} />
        {meta?.title}
      </StyledSafelinkButton>
    </ListElement>
  );
};

export default FolderResource;
