/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { breakpoints, colors, mq, spacing, misc } from '@ndla/core';
import { ArrowDropDownRounded } from '@ndla/icons/common';
import { SafeLinkButton } from '@ndla/safelink';
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
  ${mq.range({ until: breakpoints.tablet })} {
    box-shadow: inset 0 -1px ${colors.brand.light};
  }
`;

export const StyledLi = styled.li`
  display: flex;
  flex-direction: column;
  margin: 0;
`;

interface ButtonProps {
  level: number;
}

const forwardButton = (p: string) => p !== 'level';

const folderButtonOptions = { shouldForwardProp: forwardButton };

const FolderButtonContainer = styled.div`
  ${mq.range({ until: breakpoints.tablet })} {
    box-shadow: inset 0 -1px ${colors.brand.light};
  }
`;

const FolderButton = styled(ButtonV2, folderButtonOptions)<ButtonProps>`
  color: ${colors.text.primary};
  justify-content: flex-start;
  border: none;
  border-radius: 0;
  padding-top: ${spacing.small};
  padding-bottom: ${spacing.small};
  padding-left: calc(${p => p.level} * ${spacing.small});

  &:focus-visible {
    outline: 2px solid ${colors.brand.primary};
    border-radius: ${misc.borderRadius};
  }

  &:hover,
  &:active,
  &:focus {
    color: ${colors.brand.primary};
    background: none;
    border: none;
  }
`;

interface LinkProps {
  selected?: boolean;
}

const forwardLink = (p: string) => p !== 'selected';

const folderLinkOptions = { shouldForwardProp: forwardLink };

const FolderLink = styled(SafeLinkButton, folderLinkOptions)<LinkProps>`
  padding-left: 0;
  align-items: center;
  justify-content: center;
  color: ${colors.text.primary};
  background-color: ${p => (p.selected ? colors.brand.light : undefined)};
  border-color: transparent;
  &:hover,
  &:focus,
  &:active,
  &:focus-within {
    background-color: transparent;
    border-color: transparent;
  }
  &:focus-within {
    outline: 2px solid ${colors.brand.primary};
  }
`;

interface ArrowProps {
  isOpen: boolean;
}

const shouldForwardProp = (prop: string) => !['isOpen'].includes(prop);
const styledOptions = { shouldForwardProp };

const StyledArrow = styled(ArrowDropDownRounded, styledOptions)<ArrowProps>`
  color: ${colors.black};
  height: 20px;
  width: 20px;

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
  level: number;
  onClose?: () => void;
  defaultOpenFolder: string;
  meta: Record<
    string,
    GQLFolderResourceMetaSearchQuery['folderResourceMetaSearch'][0]
  >;
  root?: boolean;
}

const Folder = ({
  folder,
  meta,
  defaultOpenFolder,
  root,
  level,
  onClose,
}: Props) => {
  const { name, subfolders, resources } = folder;
  const { resourceId, subfolderId } = useParams();

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
    <StyledLi role="none" data-list-item>
      {root ? (
        <>
          <FolderButtonContainer role="none">
            <FolderLink
              to={`/folder/${folder.id}`}
              aria-owns={`folder-sublist-${folder.id}`}
              aria-expanded={isOpen}
              id={`shared-${folder.id}`}
              tabIndex={-1}
              variant={selected ? 'solid' : 'ghost'}
              selected={selected}
              color="light"
              role="treeitem"
              onKeyDown={handleLinkClick}
              onClick={() => selected && setIsOpen(!isOpen)}>
              <StyledArrow
                isOpen={isOpen}
                // @ts-ignore
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
              />
              {name}
            </FolderLink>
          </FolderButtonContainer>
        </>
      ) : (
        <FolderButtonContainer>
          <FolderButton
            level={level}
            aria-owns={`folder-sublist-${folder.id}`}
            aria-expanded={isOpen}
            id={`shared-${folder.id}`}
            tabIndex={-1}
            variant="ghost"
            color="light"
            role="treeitem"
            onKeyDown={handleKeydown}
            onClick={() => setIsOpen(!isOpen)}>
            <StyledArrow isOpen={isOpen} /> {name}
          </FolderButton>
        </FolderButtonContainer>
      )}

      {isOpen && (
        <StyledUl
          role="group"
          data-list
          aria-owns={`folder-sublist-${folder.id}`}>
          {subfolders.map(subfolder => (
            <Folder
              onClose={onClose}
              level={level + 1}
              defaultOpenFolder={defaultOpenFolder}
              key={subfolder.id}
              folder={subfolder}
              meta={meta}
            />
          ))}

          {resources.map(resource => (
            <FolderResource
              level={level}
              onClose={onClose}
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
