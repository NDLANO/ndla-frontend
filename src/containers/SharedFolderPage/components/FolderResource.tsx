/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { Launch } from '@ndla/icons/common';
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
  align-items: center;
  margin-left: calc(${p => p.level} * ${spacing.small});
  color: ${colors.text.primary};
  background-color: ${p => (p.current ? colors.brand.light : undefined)};
  border-color: transparent;
  svg {
    width: 24px;
    height: 24px;
  }
  &:focus-visible {
    outline: 2px solid ${colors.brand.primary};
  }
  &:hover,
  &:focus,
  &:focus-within {
    background-color: transparent;
    color: ${colors.text.primary};
    border-color: transparent;
  }
`;

interface ContentBadgeProps {
  current: boolean;
}

const forwardContentBadge = (p: string) => p !== 'current';
const badgeOptions = { shouldForwardProp: forwardContentBadge };

const ContentBadge = styled(ContentTypeBadge, badgeOptions)<ContentBadgeProps>`
  svg {
    color: ${p =>
      p.current ? `${colors.text.primary} !important` : undefined};
  }

  width: 26px;
  height: 26px;
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
  const isLearningPath = useMemo(
    () => resource.resourceType === 'learningpath',
    [resource.resourceType],
  );
  const link = useMemo(
    () =>
      isLearningPath
        ? resource.path
        : `/folder/${rootFolderId}/${parentId}/${resource.id}`,
    [isLearningPath, resource.path, resource.id, rootFolderId, parentId],
  );

  const onClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (isLearningPath) {
        window.open(link);
      } else {
        navigate(link);
      }
      onClose?.();
    },
    [navigate, onClose, link, isLearningPath],
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
        target={resource.resourceType === 'learningpath' ? '_blank' : undefined}
        onClick={onClick}
        variant={isCurrent ? 'solid' : 'ghost'}
        to={link}>
        <ContentBadge current={isCurrent} type={contentType!} border={false} />
        {meta?.title}
        {resource.resourceType === 'learningpath' && <Launch />}
      </StyledSafelinkButton>
    </ListElement>
  );
};

export default FolderResource;
