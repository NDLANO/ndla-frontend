/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HTMLAttributes, ReactNode, useMemo, CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { colors, stackOrder, spacing, fonts } from "@ndla/core";
import { DropdownTrigger, DropdownContent, DropdownItem, DropdownMenu } from "@ndla/dropdown-menu";
import { HashTag } from "@ndla/icons/common";
import { SafeLink, SafeLinkButton } from "@ndla/safelink";
import { resourceTypeColor } from "@ndla/ui";
import { resourceEmbedTypeMapping } from "../../util/getContentType";

export interface ResourceImageProps {
  alt: string;
  src: string;
}

export const ResourceTitleLink = styled(SafeLink)`
  box-shadow: none;
  color: ${colors.brand.primary};
  flex: 1;
  &[data-resource-available="false"] {
    color: ${colors.brand.grey};
    font-style: italic;
  }
  :after {
    content: "";
    position: absolute;
    z-index: ${stackOrder.offsetSingle};
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`;

const StyledTrigger = styled(IconButtonV2)`
  margin: 0px ${spacing.xsmall};
`;

export const resourceHeadingStyle = css`
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  // Unfortunate css needed for multi-line text overflow ellipsis.
  line-height: 1;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  grid-area: resourceTitle;
`;

const StyledTagList = styled.ul`
  list-style: none;
  display: flex;
  margin-left: ${spacing.small};
  padding: 2px;
  gap: ${spacing.xsmall};
  overflow: hidden;
  :last-child {
    margin-right: ${spacing.small};
  }
`;

const StyledTagListElement = styled.li`
  padding: 0;
  ${fonts.sizes(14)};
`;

const StyledSafeLink = styled(SafeLink)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-shadow: none;
  color: ${colors.brand.grey};
  min-height: 44px;
  min-width: 44px;
  white-space: nowrap;
  &:hover {
    color: ${colors.brand.primary};
  }
`;

const StyledResourceTypeList = styled.ul`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

const StyledTopicDivider = styled.span`
  margin: 0;
  padding: 0 ${spacing.xxsmall};
`;

const StyledResourceListElement = styled.li`
  white-space: nowrap;
  ${fonts.sizes(12)};
  margin: 0;
  line-height: 1.5;
  padding: 0;
  display: flex;
  align-items: center;
`;

const TagCounterWrapper = styled.span`
  display: flex;
  font-weight: ${fonts.weight.semibold};
  ${fonts.sizes("14px", "14px")};
`;

interface ContentIconProps extends HTMLAttributes<HTMLSpanElement> {
  contentType: string;
  children?: ReactNode;
}

const StyledContentIconWrapper = styled.span`
  width: 100%;
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--content-background-color);
`;

export const ContentIconWrapper = ({ contentType, children, ...props }: ContentIconProps) => {
  const contentIconWrapperVars = useMemo(
    () =>
      ({
        "--content-background-color": resourceTypeColor(contentType),
      }) as unknown as CSSProperties,
    [contentType],
  );
  return (
    <StyledContentIconWrapper {...props} style={contentIconWrapperVars}>
      {children}
    </StyledContentIconWrapper>
  );
};

interface TagListProps {
  tags?: string[];
  tagLinkPrefix?: string;
}

export interface LoaderProps {
  loading?: boolean;
  children?: ReactNode;
}

export const TagList = ({ tags, tagLinkPrefix }: TagListProps) => {
  const { t } = useTranslation();
  if (!tags) return null;
  return (
    <StyledTagList aria-label={t("myNdla.tagList")}>
      {tags.map((tag, i) => (
        <StyledTagListElement key={`tag-${i}`}>
          <StyledSafeLink to={`${tagLinkPrefix ? tagLinkPrefix : ""}/${encodeURIComponent(tag)}`}>
            <HashTag />
            {tag}
          </StyledSafeLink>
        </StyledTagListElement>
      ))}
    </StyledTagList>
  );
};

interface CompressedTagListProps {
  tags: string[];
  tagLinkPrefix?: string;
}

export const CompressedTagList = ({ tags, tagLinkPrefix }: CompressedTagListProps) => {
  const { t } = useTranslation();
  const visibleTags = useMemo(() => tags.slice(0, 3), [tags]);
  const remainingTags = useMemo(() => tags.slice(3, tags.length), [tags]);

  return (
    <>
      <TagList tagLinkPrefix={tagLinkPrefix} tags={visibleTags} />
      {remainingTags.length > 0 && (
        <DropdownMenu>
          <DropdownTrigger>
            <StyledTrigger
              size="xsmall"
              variant="ghost"
              colorTheme="light"
              aria-label={t("myNdla.moreTags", { count: remainingTags.length })}
            >
              {<TagCounterWrapper>{`+${remainingTags.length}`}</TagCounterWrapper>}
            </StyledTrigger>
          </DropdownTrigger>
          <DropdownContent showArrow>
            {remainingTags.map((tag, i) => (
              <DropdownItem key={`tag-${i}`}>
                <SafeLinkButton
                  to={`${tagLinkPrefix ?? ""}/${encodeURIComponent(tag)}`}
                  variant="ghost"
                  colorTheme="light"
                >
                  <HashTag />
                  {tag}
                </SafeLinkButton>
              </DropdownItem>
            ))}
          </DropdownContent>
        </DropdownMenu>
      )}
    </>
  );
};

interface ResourceTypeListProps {
  resourceTypes?: { id: string; name: string }[];
}

export const ResourceTypeList = ({ resourceTypes }: ResourceTypeListProps) => {
  const { t } = useTranslation();
  if (!resourceTypes) return null;
  return (
    <StyledResourceTypeList aria-label={t("navigation.topics")}>
      {resourceTypes.map((resource, i) => (
        <StyledResourceListElement key={resource.id}>
          {resourceEmbedTypeMapping[resource.id]
            ? t(`embed.type.${resourceEmbedTypeMapping[resource.id]}`)
            : resource.name}
          {i !== resourceTypes.length - 1 && <StyledTopicDivider aria-hidden="true">•</StyledTopicDivider>}
        </StyledResourceListElement>
      ))}
    </StyledResourceTypeList>
  );
};
