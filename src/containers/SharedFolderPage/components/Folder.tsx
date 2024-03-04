/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { KeyboardEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { colors, misc, spacing } from "@ndla/core";
import { ArrowDropDownRounded } from "@ndla/icons/common";
import { SafeLinkButton } from "@ndla/safelink";
import FolderResource from "./FolderResource";
import { GQLFolder, GQLFolderResourceMetaSearchQuery } from "../../../graphqlTypes";
import { routes } from "../../../routeHelpers";

export const StyledUl = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  margin: 0;
`;

export const StyledLi = styled.li`
  display: flex;
  flex-direction: column;
  padding: 0;
`;

interface LinkProps {
  level?: number;
}

const forwardLink = (p: string) => p !== "level";

const folderLinkOptions = { shouldForwardProp: forwardLink };

const FolderButtonContainer = styled.div`
  padding-bottom: ${spacing.xxsmall};
  padding-top: ${spacing.xxsmall};
  border-bottom: 1px solid ${colors.brand.light};
`;

const FolderLink = styled(SafeLinkButton)`
  padding-left: 0;
  align-items: center;
  justify-content: center;
  color: ${colors.text.primary};
  border: none;
  &:hover,
  &:active {
    color: ${colors.brand.primary};
    background-color: transparent;
    border-color: transparent;
    text-decoration: underline;
  }
  &:focus-visible {
    color: ${colors.brand.primary};
    border: none;
    background-color: transparent;
    outline: 2px solid ${colors.brand.primary};
  }
`;

const StyledArrow = styled(ArrowDropDownRounded)`
  height: 30px;
  width: 30px;
  color: ${colors.text.primary};
`;

const FolderNavigation = styled("div", folderLinkOptions)<LinkProps>`
  padding-left: calc(${(p) => p.level} * ${spacing.small});
`;

const FolderNavigationContent = styled.div`
  display: flex;
  align-content: center;
  &[data-selected="true"] {
    background: ${colors.brand.light};
    border-radius: ${misc.borderRadius};
    &:hover {
      background: transparent;
    }
  }
`;

const ToggleOpenButton = styled.button`
  border: 0;
  background: transparent;
  cursor: pointer;
  width: 40px;
  height: 40px;
  padding: 0;
`;

const arrowOpenCss = css`
  transform: rotate(-90deg);
`;

const containsFolder = (folder: GQLFolder, targetId: string): boolean => {
  return folder.id === targetId || !!folder.subfolders.find((subfolder) => containsFolder(subfolder, targetId));
};

const containsResource = (folder: GQLFolder): boolean => {
  return folder.resources.length > 0 || !!folder.subfolders.find((subfolder) => containsResource(subfolder));
};

interface Props {
  folder: GQLFolder;
  level: number;
  onClose?: () => void;
  defaultOpenFolder: string;
  setFocus: (id: string) => void;
  meta: Record<string, GQLFolderResourceMetaSearchQuery["folderResourceMetaSearch"][0]>;
  root?: boolean;
  subfolderKey?: string;
}

const Folder = ({ folder, meta, setFocus, defaultOpenFolder, root, level, onClose, subfolderKey }: Props) => {
  const { name, subfolders, resources, status } = folder;
  const { folderId: rootFolderId, resourceId, subfolderId } = useParams();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(containsFolder(folder, defaultOpenFolder) || !!root);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isEmpty = useMemo(() => !containsResource(folder), []);

  if (isEmpty) {
    return null;
  }

  const preview = status === "private";

  const handleKeydown = (e: KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (e.key === "ArrowLeft") {
      setIsOpen(false);
    } else if (e.key === "ArrowRight") {
      setIsOpen(true);
    }
  };

  const handleLinkClick = (e: KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    handleKeydown(e);
    if (e.key === " " || e.key === "Enter") {
      (e.target as HTMLElement | undefined)?.click();
      onClose?.();
      e.preventDefault();
    }
  };

  const rootSelected = !resourceId && !subfolderId;
  const subfolderSelected = !resourceId && subfolderKey === subfolderId;

  const toggleButtonAriaLabel = isOpen ? t("myNdla.folder.close") : t("myNdla.folder.open");

  return (
    <StyledLi role="none" data-list-item>
      {root ? (
        <>
          <FolderButtonContainer role="none">
            <FolderNavigation level={0}>
              <FolderNavigationContent data-selected={rootSelected}>
                <ToggleOpenButton
                  type="button"
                  aria-expanded={isOpen}
                  aria-label={toggleButtonAriaLabel}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                  }}
                >
                  <StyledArrow css={!isOpen ? arrowOpenCss : undefined} />
                </ToggleOpenButton>
                <FolderLink
                  to={preview ? routes.myNdla.folderPreview(folder.id) : routes.myNdla.folder(folder.id)}
                  aria-owns={`folder-sublist-${folder.id}`}
                  id={`shared-${folder.id}`}
                  tabIndex={-1}
                  colorTheme="light"
                  variant="ghost"
                  color="light"
                  role="treeitem"
                  onKeyDown={handleLinkClick}
                  onClick={() => {
                    setFocus(`shared-${folder.id}`);
                    setIsOpen(true);
                    onClose?.();
                  }}
                >
                  {name}
                </FolderLink>
              </FolderNavigationContent>
            </FolderNavigation>
          </FolderButtonContainer>
        </>
      ) : (
        <FolderButtonContainer>
          <FolderNavigation level={level}>
            <FolderNavigationContent data-selected={subfolderSelected}>
              <ToggleOpenButton
                type="button"
                aria-expanded={isOpen}
                aria-label={toggleButtonAriaLabel}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
              >
                <StyledArrow css={!isOpen ? arrowOpenCss : undefined} />
              </ToggleOpenButton>
              <FolderLink
                to={
                  preview
                    ? `${routes.myNdla.folderPreview(rootFolderId as string)}/${subfolderKey}`
                    : `${routes.myNdla.folder(rootFolderId as string)}/${subfolderKey}`
                }
                aria-owns={`folder-sublist-${folder.id}`}
                id={`shared-${folder.id}`}
                tabIndex={-1}
                variant="ghost"
                colorTheme="light"
                role="treeitem"
                onKeyDown={handleKeydown}
                onClick={() => {
                  setFocus(`shared-${folder.id}`);
                  setIsOpen(true);
                }}
              >
                {name}
              </FolderLink>
            </FolderNavigationContent>
          </FolderNavigation>
        </FolderButtonContainer>
      )}

      {isOpen && (
        <StyledUl role="group" data-list aria-owns={`folder-sublist-${folder.id}`}>
          {resources.map((resource, i) => (
            <FolderResource
              setFocus={setFocus}
              level={level}
              onClose={onClose}
              key={resource.id}
              parentId={folder.id}
              isLast={i === resources.length - 1}
              meta={meta[`${resource.resourceType}-${resource.resourceId}`]}
              resource={resource}
              preview={preview}
            />
          ))}
          {subfolders.map((subfolder) => (
            <Folder
              onClose={onClose}
              setFocus={setFocus}
              level={level + 1}
              defaultOpenFolder={defaultOpenFolder}
              key={subfolder.id}
              folder={subfolder}
              meta={meta}
              subfolderKey={subfolder.id}
            />
          ))}
        </StyledUl>
      )}
    </StyledLi>
  );
};

export default Folder;
