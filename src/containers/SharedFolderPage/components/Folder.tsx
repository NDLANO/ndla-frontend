/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import { ArrowDropDown } from '@ndla/icons/common';
import { SafeLinkButton } from '@ndla/safelink';
import { useMastheadHeight } from '@ndla/ui';
import { KeyboardEvent, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  GQLFolder,
  GQLFolderResourceMetaSearchQuery,
} from '../../../graphqlTypes';
import FolderResource from './FolderResource';

export const StyledUl = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  padding-left: ${spacing.nsmall};
`;

export const StyledLi = styled.li<StyledResourceProps>`
  margin: 0;
  padding: ${({ root }) => (root ? 0 : spacing.xxsmall)} 0;
`;

interface StyledResourceProps {
  root?: boolean;
}

const StyledFolderButton = styled(ButtonV2)<StyledResourceProps>`
  justify-content: flex-start;
  &,
  &:hover,
  &:active,
  &:focus {
    color: ${({ root }) => (root ? colors.brand.primary : colors.black)};
    background: ${({ root }) => (root ? colors.white : 'none')};
    border: none;
  }

  width: ${({ root }) => root && '100%'};
`;

const StyledFolderLink = StyledFolderButton.withComponent(SafeLinkButton);

interface StyledArrowProps {
  isOpen: boolean;
}

const StyledArrow = styled(ArrowDropDown)<StyledArrowProps>`
  color: ${colors.black};
  height: 20px;
  width: 21px;

  transform: ${({ isOpen }) => !isOpen && 'rotate(-90deg)'};
`;

const containsFolder = (folder: GQLFolder, targetId: string): boolean => {
  return (
    folder.id === targetId ||
    !!folder.subfolders.find(subfolder => containsFolder(subfolder, targetId))
  );
};

const containsResource = (folder: GQLFolder): boolean => {
  return (
    folder.resources.length > 0 ||
    !!folder.subfolders.find(subfolder => containsResource(subfolder))
  );
};

interface Props {
  folder: GQLFolder;
  defaultOpenFolder: string;
  meta: Record<
    string,
    GQLFolderResourceMetaSearchQuery['folderResourceMetaSearch'][0]
  >;
  root?: boolean;
}

const Folder = ({ folder, meta, defaultOpenFolder, root }: Props) => {
  const { name, subfolders, resources } = folder;
  const { resourceId, subfolderId } = useParams();
  const { height } = useMastheadHeight();

  const [isOpen, setIsOpen] = useState(
    containsFolder(folder, defaultOpenFolder) || !!root,
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isEmpty = useMemo(() => !containsResource(folder), []);

  if (isEmpty) {
    return null;
  }

  const handleKeydown = (
    e: KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    if (e.key === 'ArrowLeft') {
      setIsOpen(false);
    } else if (e.key === 'ArrowRight') {
      setIsOpen(true);
    }
  };

  const handleLinkClick = (
    e: KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    handleKeydown(e);
    if (e.key === ' ') {
      (e.target as HTMLElement | undefined)?.click();
      e.preventDefault();
    }
  };

  const selected = !resourceId && !subfolderId;

  return (
    <StyledLi role="none" data-list-item root>
      {root ? (
        <StyledFolderLink
          to={`/folder/${folder.id}`}
          aria-owns={`folder-sublist-${folder.id}`}
          aria-expanded={isOpen}
          id={`shared-${folder.id}`}
          tabIndex={-1}
          css={css`
            position: sticky;
            top: ${height}px;
          `}
          variant="ghost"
          color="light"
          role="treeitem"
          onKeyDown={handleLinkClick}
          onClick={() => selected && setIsOpen(!isOpen)}
          root={root}>
          <StyledArrow isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
          {name}
        </StyledFolderLink>
      ) : (
        <StyledFolderButton
          aria-owns={`folder-sublist-${folder.id}`}
          aria-expanded={isOpen}
          id={`shared-${folder.id}`}
          tabIndex={-1}
          variant="ghost"
          color="light"
          role="treeitem"
          onKeyDown={handleKeydown}
          onClick={() => setIsOpen(!isOpen)}
          root={root}>
          <StyledArrow isOpen={isOpen} /> {name}
        </StyledFolderButton>
      )}

      {isOpen && (
        <StyledUl
          role="group"
          data-list
          aria-owns={`folder-sublist-${folder.id}`}>
          {subfolders.map(subfolder => (
            <Folder
              defaultOpenFolder={defaultOpenFolder}
              key={subfolder.id}
              folder={subfolder}
              meta={meta}
            />
          ))}

          {resources.map(resource => (
            <FolderResource
              key={resource.id}
              parentId={folder.id}
              meta={meta[`${resource.resourceType}-${resource.resourceId}`]}
              resource={resource}
            />
          ))}
        </StyledUl>
      )}
    </StyledLi>
  );
};

export default Folder;
