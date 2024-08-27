/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  COPYRIGHTED,
  getLicenseByAbbreviation,
  getLicenseRightByAbbreviation,
  getResourceTypeNamespace,
  isCreativeCommonsLicense,
  metaTypes,
} from "@ndla/licenses";
import type { MetaType } from "@ndla/licenses";
import { Heading, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { LicenseLink } from "@ndla/ui";
import LicenseBylineDescriptionList from "./LicenseBylineDescriptionList";

export const MediaList = styled("ul", {
  base: {
    width: "100%",

    "& > li": {
      paddingBlock: "xlarge",
      borderBottom: "1px solid",
      borderColor: "stroke.subtle",
      _last: {
        borderBottom: "none",
        paddingBlockEnd: "0",
      },
      _first: {
        paddingBlockStart: "medium",
      },
    },

    "& p ": {
      marginBlockEnd: "3xsmall",
    },
    tabletDown: {
      "& button, a": {
        width: "100%",
      },
    },
  },
});

const MediaListLicenseButtonWrapper = styled("div", {
  base: { display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "xxlarge" },
});

interface MediaSourceProps {
  licenseType: string;
  title?: string;
  sourceTitle?: string;
  sourceType?: string;
  children?: ReactNode;
}

export const MediaListLicense = ({ licenseType, title, sourceTitle, sourceType, children }: MediaSourceProps) => {
  const { i18n, t } = useTranslation();
  const license = getLicenseByAbbreviation(licenseType, i18n.language);
  const { description } = getLicenseRightByAbbreviation(license.rights[0] ?? "", i18n.language);

  const licenseRightsText = license.rights[0] === COPYRIGHTED ? "restrictedUseText" : "licenseText";
  return (
    <div>
      <MediaListLicenseButtonWrapper>
        {title && (
          <Heading textStyle="title.small" fontWeight="semibold" asChild consumeCss>
            <h3>{`${title} "${sourceTitle}"`}</h3>
          </Heading>
        )}
        <div>{children}</div>
      </MediaListLicenseButtonWrapper>
      {!!description && (
        <Text textStyle="body.medium">
          {`${t(`license.${sourceType}.${licenseRightsText}`)} `}
          <LicenseLink license={license} />
          {`. ${description}`}
        </Text>
      )}
      <LicenseBylineDescriptionList licenseRights={license.rights} locale={i18n.language} />
    </div>
  );
};

export const MediaListItem = styled("li", {
  base: {
    "& img": { width: "100%" },
  },
});

export const MediaListContent = styled("div", { base: { display: "flex", flexDirection: "column", gap: "3xsmall" } });

interface MediaListItemBodyProps {
  children: ReactNode;
  license: string;
  locale: string;
  resourceUrl?: string;
  resourceType?: "video" | "image" | "audio" | "text" | "h5p" | "podcast";
}

const StyledSpan = styled("span", { base: { display: "none" } });

const StyledWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

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

  return (
    <StyledWrapper {...containerProps}>
      {/* @ts-ignore */}
      {metaResourceType && <StyledSpan rel="dct:type" href={metaResourceType} />}
      {children}
    </StyledWrapper>
  );
};

export const MediaListItemActions = styled("div", {
  base: {
    display: "flex",
    flexWrap: "wrap",
    gap: "xsmall",
    marginBlockStart: "3xsmall",
    "& > a": {
      width: "fit-content",
    },

    tabletDown: {
      flexDirection: "column",
    },
  },
});

const isLink = (url: string) => url.startsWith("http") || url.startsWith("https");

interface HandleLinkProps {
  url: string;
  children: ReactNode;
  type: ItemTypeWithDescription["metaType"];
}

const licenceTag = (type: ItemTypeWithDescription["metaType"], url: boolean): string | undefined =>
  ({
    title: "dct:title",
    author: "cc:attributionName",
    copyrightHolder: "cc:copyrightHolder",
    contributor: "cc:contributor",
    other: url ? "cc:attributionURL" : undefined,
    //@ts-ignore
  })[type];

export const HandleLink = ({ url, children, type }: HandleLinkProps) => {
  const tag = licenceTag(type, isLink(url));

  if (isLink(url)) {
    return (
      <SafeLink to={url} target="_blank" rel={`noopener noreferrer ${tag}`}>
        {children}
      </SafeLink>
    );
  }
  // eslint-disable-next-line react/no-unknown-property
  return <span property={tag}>{children}</span>;
};

export type ItemType = ItemTypeWithDescription | DescriptionlessItemType;

interface ItemTypeWithDescription {
  label: string;
  description: string;
  metaType: Omit<MetaType, "otherWithoutDescription">;
}

interface DescriptionlessItemType {
  label: string;
  metaType: "otherWithoutDescription";
}

const isOtherWithoutDescription = (item: ItemType): item is DescriptionlessItemType =>
  item.metaType === metaTypes.otherWithoutDescription;

interface MediaListItemMetaProps {
  items?: ItemType[];
}

const ItemText = ({ item }: { item: ItemType }) => {
  if (isOtherWithoutDescription(item)) {
    return item.label;
  }

  return (
    <Text textStyle="body.medium">
      {`${item.label}: `}
      <HandleLink url={item.description} type={item.metaType}>
        {item.description}
      </HandleLink>
    </Text>
  );
};

const StyledListItem = styled("li", {
  base: {
    wordBreak: "break-word",
  },
});

export const MediaListItemMeta = ({ items = [] }: MediaListItemMetaProps) => {
  return (
    <ul>
      {items.map((item) => (
        <StyledListItem key={item.label}>
          <ItemText item={item} />
        </StyledListItem>
      ))}
    </ul>
  );
};
