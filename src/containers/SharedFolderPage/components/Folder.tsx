/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import { ArrowDropDown } from '@ndla/icons/common';
import { KeyboardEvent, useMemo, useState } from 'react';
import {
  GQLFolder,
  GQLFolderResourceMetaSearchQuery,
} from '../../../graphqlTypes';
import FolderResource from './FolderResource';

export const StyledUl = styled.ul`
  margin-left: ${spacing.nsmall};
  width: 100%;
  list-style: none;
`;

interface StyledButtonProps {
  root?: boolean;
}

export const StyledFolderButton = styled(ButtonV2)<StyledButtonProps>`
  &,
  &:hover,
  &:active,
  &:focus {
    color: ${({ root }) => (root ? colors.brand.primary : colors.black)};
    background: none;
    border: none;
  }
`;

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

  const [isOpen, setIsOpen] = useState(
    containsFolder(folder, defaultOpenFolder),
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isEmpty = useMemo(() => !containsResource(folder), []);

  if (isEmpty) {
    return null;
  }

  const handleKeydown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowLeft') {
      setIsOpen(false);
    } else if (e.key === 'ArrowRight') {
      setIsOpen(true);
    }
  };

  return (
    <li role="none" data-list-item>
      <StyledFolderButton
        aria-owns={`folder-sublist-${folder.id}`}
        aria-expanded={isOpen}
        id={`folder-${folder.id}`}
        tabIndex={-1}
        variant="ghost"
        color="light"
        role="treeitem"
        onKeyDown={handleKeydown}
        onClick={() => setIsOpen(!isOpen)}
        root={root}>
        <StyledArrow isOpen={isOpen} /> {name}
      </StyledFolderButton>
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
    </li>
  );
};

export default Folder;
