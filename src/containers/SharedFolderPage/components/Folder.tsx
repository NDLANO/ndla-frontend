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
import { breakpoints, colors, mq, spacing } from '@ndla/core';
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
  padding-top: ${spacing.small};
  padding-bottom: ${spacing.small};
  padding-left: calc(${p => p.level} * ${spacing.small});

  &:hover,
  &:focus-visible {
    color: ${colors.brand.primary};
    background: none;
    outline: 2px solid ${colors.brand.primary};
  }
`;

const FolderLink = styled(SafeLinkButton)`
  padding-left: 0;
  align-items: center;
  justify-content: center;
  color: ${colors.text.primary};
  border: none;
  &:hover,
  &:focus-visible {
    color: ${colors.brand.primary};
    border: none;
    background-color: transparent;
    outline: 2px solid ${colors.brand.primary};
  }
`;

const StyledArrow = styled(ArrowDropDownRounded)`
  height: 20px;
  width: 20px;
`;

const arrowOpenCss = css`
  transform: rotate(-90deg);
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
  setFocus: (id: string) => void;
  meta: Record<
    string,
    GQLFolderResourceMetaSearchQuery['folderResourceMetaSearch'][0]
  >;
  root?: boolean;
}

const Folder = ({
  folder,
  meta,
  setFocus,
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
    if (e.key === ' ' || e.key === 'Enter') {
      (e.target as HTMLElement | undefined)?.click();
      onClose?.();
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
              colorTheme={'light'}
              variant={selected ? 'solid' : 'ghost'}
              color="light"
              role="treeitem"
              onKeyDown={handleLinkClick}
              onClick={() => {
                setIsOpen(!isOpen);
                setFocus(`shared-${folder.id}`);
                onClose?.();
              }}
            >
              <StyledArrow
                css={!isOpen ? arrowOpenCss : undefined}
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
            colorTheme="light"
            role="treeitem"
            onKeyDown={handleKeydown}
            onClick={() => {
              setFocus(`shared-${folder.id}`);
              setIsOpen(!isOpen);
            }}
          >
            <StyledArrow css={!isOpen ? arrowOpenCss : undefined} /> {name}
          </FolderButton>
        </FolderButtonContainer>
      )}

      {isOpen && (
        <StyledUl
          role="group"
          data-list
          aria-owns={`folder-sublist-${folder.id}`}
        >
          {subfolders.map(subfolder => (
            <Folder
              onClose={onClose}
              setFocus={setFocus}
              level={level + 1}
              defaultOpenFolder={defaultOpenFolder}
              key={subfolder.id}
              folder={subfolder}
              meta={meta}
            />
          ))}
          {resources.map(resource => (
            <FolderResource
              setFocus={setFocus}
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
