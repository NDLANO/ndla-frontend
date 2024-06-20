/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentProps, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { breakpoints, colors, fonts, mq, spacing } from "@ndla/core";
import {
  getLicenseByAbbreviation,
  getLicenseRightByAbbreviation,
  getResourceTypeNamespace,
  isCreativeCommonsLicense,
  metaTypes,
} from "@ndla/licenses";
import type { MetaType } from "@ndla/licenses";
import { SafeLink } from "@ndla/safelink";
import { Text } from "@ndla/typography";
import { LicenseLink, LicenseBylineDescriptionList } from "@ndla/ui";
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

interface MediaSourceProps {
  licenseType: string;
  title?: string;
  sourceTitle?: string;
  sourceType?: string;
}

const MediaLicenseContainer = styled.div`
  padding-bottom: ${spacing.normal};
`;

const BodyTitle = styled(Text)`
  font-weight: ${fonts.weight.bold};
  padding-bottom: ${spacing.xsmall};
  + p {
    margin-top: ${spacing.small};
  }
`;

export const MediaListLicense = ({ licenseType, title, sourceTitle, sourceType }: MediaSourceProps) => {
  const { i18n, t } = useTranslation();

  const license = getLicenseByAbbreviation(licenseType, i18n.language);
  const { description } = getLicenseRightByAbbreviation(license.rights[0] ?? "", i18n.language);

  return (
    <MediaLicenseContainer>
      {title ? (
        <BodyTitle element="label" margin="none" textStyle="meta-text-medium">
          {title}
          {` "${sourceTitle}"`}
        </BodyTitle>
      ) : null}
      <br />
      <span>
        {t(`license.${sourceType}.licenseText`)} <LicenseLink license={license} asLink={!!license.url.length} />.{" "}
        {description}
      </span>
      <LicenseBylineDescriptionList licenseRights={license.rights} locale={i18n.language} />
    </MediaLicenseContainer>
  );
};

const StyledMediaListItem = styled.li`
  margin-bottom: ${spacing.small};
  padding: ${spacing.small} 0;
  border-bottom: 1px solid ${colors.brand.tertiary};
  list-style: none;
  display: flex;
  flex-direction: column;

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
  width: 100%;
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

export const MediaListItemImage = ({ children }: MediaListItemImageProps) => <ImageWrapper>{children}</ImageWrapper>;

interface MediaListItemBodyProps {
  children: ReactNode;
  license: string;
  locale: string;
  resourceUrl?: string;
  resourceType?: "video" | "image" | "audio" | "text" | "h5p" | "podcast";
  messages?: {
    modelPermission?: string;
  };
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

export const MediaListItemBody = ({
  children,
  license: licenseAbbreviation,
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
      {children}
    </StyledMediaListItemBody>
  );
};

const StyledMediaListItemActions = styled.div`
  display: flex;
  align-items: start;
  margin: ${spacing.small} 0 0 0;
  width: 100%;
  button,
  a {
    margin: 0 ${spacing.small} ${spacing.small} 0;
  }
  ${mq.range({ until: breakpoints.mobileWide })} {
    display: flex;
    flex-direction: column;
    button,
    a {
      margin: 0 0 ${spacing.small} 0;
      width: 100%;
    }
    span {
      width: 100%;
      button {
        width: 100%;
      }
    }
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
    return item.label;
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
  padding: 0;
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
  padding-bottom: ${spacing.xsmall};
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
