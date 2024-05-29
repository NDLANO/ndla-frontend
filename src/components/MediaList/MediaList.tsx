/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentProps, ReactNode } from "react";
import styled from "@emotion/styled";
import { breakpoints, colors, fonts, mq, spacing, stackOrder } from "@ndla/core";
import { Launch } from "@ndla/icons/common";
import {
  getLicenseByAbbreviation,
  getResourceTypeNamespace,
  isCreativeCommonsLicense,
  metaTypes,
} from "@ndla/licenses";
import type { MetaType } from "@ndla/licenses";
import { LicenseDescription } from "@ndla/notion";
import { SafeLink } from "@ndla/safelink";
import { Text } from "@ndla/typography";
import { uuid } from "@ndla/util";

const StyledMediaList = styled.ul`
  padding-left: 0;
  display: flex;
  flex-direction: column;
  margin: ${spacing.normal} 0;
`;

export const MediaList = ({ children, ...rest }: ComponentProps<"ul">) => (
  <StyledMediaList {...rest}>{children}</StyledMediaList>
);

const StyledMediaListItem = styled.li`
  margin-bottom: ${spacing.small};
  padding: ${spacing.small} 0;
  border-bottom: 1px solid ${colors.brand.tertiary};
  list-style: none;
  ${mq.range({ from: breakpoints.tablet })} {
    display: flex;
    flex-direction: row;
  }

  &:last-of-type {
    border-bottom: none;
  }
  img {
    width: 100%;
  }
`;

export const MediaListItem = ({ children, ...rest }: ComponentProps<"li">) => (
  <StyledMediaListItem {...rest}>{children}</StyledMediaListItem>
);

interface MediaListItemImageProps {
  children: ReactNode;
  canOpen?: boolean;
}

const ImageWrapper = styled.div`
  position: relative;
  align-self: flex-start;
  margin-right: ${spacing.small};
  ${mq.range({ from: breakpoints.tablet })} {
    width: 25%;
  }
  a {
    display: block;
    box-shadow: none;
  }
  &:hover,
  &:focus-visible {
    [data-open-indicator] {
      background-color: ${colors.brand.dark};
      padding: ${spacing.xsmall};
    }
  }
`;

const OpenIndicator = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  right: ${spacing.xsmall};
  bottom: ${spacing.xsmall};
  padding: ${spacing.xxsmall};
  transition: all 50ms ease-in;
  background-color: ${colors.brand.primary};
  border-radius: 100%;
  pointer-events: none;
  z-index: ${stackOrder.offsetSingle};
  svg {
    color: ${colors.white};
    width: ${spacing.normal};
    height: ${spacing.normal};
  }
`;

export const MediaListItemImage = ({ children, canOpen }: MediaListItemImageProps) => (
  <ImageWrapper>
    {canOpen && (
      <OpenIndicator data-open-indicator>
        <Launch />
      </OpenIndicator>
    )}
    {children}
  </ImageWrapper>
);

interface MediaListItemBodyProps {
  children: ReactNode;
  license: string;
  locale: string;
  resourceUrl?: string;
  resourceType?: "video" | "image" | "audio" | "text" | "h5p" | "podcast";
  messages?: {
    modelPremission?: string;
  };
  title?: string;
}

const StyledMediaListItemBody = styled.div`
  ${fonts.size.text.metaText.small};
  ${mq.range({ from: breakpoints.tablet })} {
    max-width: 70%;
  }
  ${mq.range({ from: breakpoints.desktop })} {
    max-width: 75%;
  }
`;

const BodyTitle = styled(Text)`
  color: ${colors.brand.primary};
  font-weight: ${fonts.weight.bold};
  margin-bottom: ${spacing.xsmall};
  + p {
    margin-top: ${spacing.small};
  }
`;

export const MediaListItemBody = ({
  children,
  license: licenseAbbreviation,
  messages,
  title,
  locale,
  resourceUrl = "", // defaults to current page
  resourceType,
}: MediaListItemBodyProps) => {
  const license = getLicenseByAbbreviation(licenseAbbreviation, locale);
  const containerProps = isCreativeCommonsLicense(license.rights)
    ? {
        "xmlns:cc": "https://creativecommons.org/ns#",
        "xmlns:dct": "http://purl.org/dc/terms/",
        about: resourceUrl,
      }
    : {};

  const metaResourceType = getResourceTypeNamespace(resourceType);
  const hidden = {
    display: "none",
  };

  return (
    <StyledMediaListItemBody {...containerProps}>
      {/* @ts-ignore */}
      {metaResourceType && <span rel="dct:type" href={metaResourceType} style={hidden} />}
      {title ? (
        <BodyTitle element="h3" margin="none" textStyle="meta-text-medium">
          {title}
        </BodyTitle>
      ) : null}
      <LicenseDescription locale={locale} messages={messages} licenseRights={license.rights} highlightCC />
      <SafeLink rel="noopener noreferrer license" target="_blank" to={license.url}>
        {license.linkText}
      </SafeLink>
      {children}
    </StyledMediaListItemBody>
  );
};

const StyledMediaListItemActions = styled.div`
  margin: ${spacing.small} 0;
  list-style: none;
  width: 100%;
  button,
  a {
    margin: 0 ${spacing.small} ${spacing.small} 0;
  }
`;

export const MediaListItemActions = ({ children, ...rest }: ComponentProps<"div">) => (
  <StyledMediaListItemActions {...rest}>{children}</StyledMediaListItemActions>
);

const isLink = (text: string) => text.startsWith("http") || text.startsWith("https");

interface HandleLinkProps {
  text: string;
  children: ReactNode;
}

export const HandleLink = ({ text, children }: HandleLinkProps) => {
  if (isLink(text)) {
    return (
      <SafeLink to={text} target="_blank" rel="noopener noreferrer">
        {children}
      </SafeLink>
    );
  }
  return <span>{children}</span>;
};

const attributionTypes = [metaTypes.author, metaTypes.copyrightHolder, metaTypes.contributor];

export type ItemType = ItemTypeWithDescription | DescriptionLessItemType;

interface ItemTypeWithDescription {
  label: string;
  description: string;
  metaType: Omit<MetaType, "otherWithoutDescription">;
}

interface DescriptionLessItemType {
  label: string;
  metaType: "otherWithoutDescription";
}

function isOtherWithoutDescription(item: ItemType): item is DescriptionLessItemType {
  return item.metaType === metaTypes.otherWithoutDescription;
}

interface MediaListItemMetaProps {
  items?: ItemType[];
}

const ItemText = ({ item }: { item: ItemType }) => {
  if (isOtherWithoutDescription(item)) {
    return <>{item.label}</>;
  }

  return (
    <>
      {item.label}: <HandleLink text={item.description}>{item.description}</HandleLink>
    </>
  );
};

function isAttributionItem(item: ItemType): item is ItemTypeWithDescription {
  if (isOtherWithoutDescription(item)) return false;
  return attributionTypes.some((type) => type === item.metaType);
}

const StyledMediaListItemMeta = styled.ul`
  margin: ${spacing.small} 0;
  list-style: none;
  width: 100%;
  button,
  a {
    margin: 0 ${spacing.small} ${spacing.small} 0;
  }
`;

const StyledMediaListMetaItem = styled.li`
  margin: 0;
  padding: 0;
`;

export const MediaListItemMeta = ({ items = [] }: MediaListItemMetaProps) => {
  const attributionItems = items.filter(isAttributionItem);
  const attributionMeta = attributionItems.map((item) => `${item.label}: ${item.description}`).join(", ");

  return (
    <StyledMediaListItemMeta property="cc:attributionName" content={attributionMeta}>
      {items.map((item) => (
        <StyledMediaListMetaItem key={uuid()}>
          <ItemText item={item} />
        </StyledMediaListMetaItem>
      ))}
    </StyledMediaListItemMeta>
  );
};
