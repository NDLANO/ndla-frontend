/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import { Launch } from "@ndla/icons/common";
import { SafeLinkButton } from "@ndla/safelink";
import { ContentTypeBadge } from "@ndla/ui";
import { GQLFolderResource, GQLFolderResourceMetaSearchQuery } from "../../../graphqlTypes";
import { routes } from "../../../routeHelpers";
import { contentTypeMapping, resourceEmbedTypeMapping } from "../../../util/getContentType";

interface StyledProps {
  level: number;
}

const shouldForwardProp = (p: string) => p !== "level";
const styledOptions = { shouldForwardProp };

const StyledSafelinkButton = styled(SafeLinkButton, styledOptions)<StyledProps>`
  width: 100%;
  text-align: left;
  align-items: center;
  margin-left: calc(${(p) => p.level} * ${spacing.small});
  color: ${colors.text.primary};
  svg {
    width: 24px;
    height: 24px;
    color: ${colors.text.primary} !important;
  }
  &:hover,
  &:active {
    background-color: transparent;
    border-color: transparent;
    text-decoration: underline;
    color: ${colors.brand.primary};
    svg {
      color: ${colors.brand.primary} !important;
    }
  }
  &:focus-visible {
    color: ${colors.brand.primary};
    background-color: transparent;
    border-color: transparent;
    outline: 2px solid ${colors.brand.primary};
    svg {
      color: ${colors.brand.primary} !important;
    }
  }
`;

const ListElement = styled.li`
  margin: 0;
  &[data-last="true"] {
    border-bottom: 1px solid ${colors.brand.light};
  }
`;

const StyledSpan = styled.span`
  flex: 1;
`;

const allContentTypes = {
  ...contentTypeMapping,
  ...resourceEmbedTypeMapping,
};

interface Props {
  parentId: string;
  meta?: GQLFolderResourceMetaSearchQuery["folderResourceMetaSearch"][0];
  resource: GQLFolderResource;
  onClose?: () => void;
  setFocus: (id: string) => void;
  level: number;
  isLast?: boolean;
}

const FolderResource = ({ parentId, resource, meta, setFocus, level, isLast, onClose }: Props) => {
  const { folderId: rootFolderId, subfolderId, resourceId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isLearningPathOrCase = useMemo(
    () => resource.resourceType === "learningpath" || resource.resourceType === "multidisciplinary",
    [resource.resourceType],
  );
  const link = useMemo(
    () => (isLearningPathOrCase ? resource.path : `${routes.folder(rootFolderId ?? "")}/${parentId}/${resource.id}`),
    [isLearningPathOrCase, resource.path, resource.id, rootFolderId, parentId],
  );

  const onClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setFocus(`shared-${parentId}-${resource.id}`);
      if (isLearningPathOrCase) {
        window.open(link);
      } else {
        navigate(link);
      }
      onClose?.();
    },
    [setFocus, parentId, resource.id, isLearningPathOrCase, onClose, link, navigate],
  );

  const isCurrent = resource.id === resourceId && parentId === subfolderId;
  const openInfo = resource.resourceType === "learningpath" ? t("myNdla.sharedFolder.willOpenInNewTab") : "";

  const maybeContentType = meta?.resourceTypes?.find((rt) => allContentTypes[rt.id]);

  const contentType = allContentTypes[maybeContentType?.id ?? "default"];

  return (
    <ListElement data-last={isLast} role="none">
      <StyledSafelinkButton
        aria-current={isCurrent ? "page" : undefined}
        tabIndex={-1}
        level={level}
        id={`shared-${parentId}-${resource.id}`}
        aria-label={[`${meta?.title}.`, `${t(`contentTypes.${contentType}`)}`, openInfo].filter((i) => !!i).join(" ")}
        role="treeitem"
        target={resource.resourceType === "learningpath" ? "_blank" : undefined}
        onClick={onClick}
        variant={isCurrent ? "solid" : "ghost"}
        colorTheme="light"
        to={link}
      >
        <ContentTypeBadge type={contentType!} border={false} />
        <StyledSpan>{meta?.title}</StyledSpan>
        {(resource.resourceType === "learningpath" || resource.resourceType === "multidisciplinary") && (
          <Launch height={"24px"} width={"24px"} />
        )}
      </StyledSafelinkButton>
    </ListElement>
  );
};

export default FolderResource;
