/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { breakpoints } from "@ndla/core";
import {
  Badge,
  ListItemContent,
  ListItemHeading,
  ListItemImage,
  ListItemRoot,
  ListItemVariantProps,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { cva } from "@ndla/styled-system/css";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { BadgesContainer, ContentType, contentTypes } from "@ndla/ui";
import { ContentTypeFallbackIcon } from "../../components/ContentTypeFallbackIcon";
import { RELEVANCE_CORE } from "../../constants";
import { GQLResourceType } from "../../graphqlTypes";
import { useListItemTraits } from "../../util/listItemTraits";

const StyledListItemContent = styled(ListItemContent, {
  base: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
});

interface Props {
  id: string;
  showContentTypeDescription?: boolean;
  extraBottomMargin?: boolean;
  showAdditionalResources?: boolean;
  language?: string;
  currentResourceContentType?: ContentType;
}

export type Resource = {
  id: string;
  name: string;
  url?: string;
  contentType?: string;
  resourceTypes?: GQLResourceType[];
  active?: boolean;
  relevanceId?: string;
  article?: {
    metaImage?: { url?: string; alt?: string };
    traits?: string[];
  };
  learningpath?: {
    coverphoto?: { url?: string };
  };
};

const getListItemColorTheme = (
  contentType?: ContentType,
): Exclude<NonNullable<ListItemVariantProps["colorTheme"]>, "neutral"> => {
  switch (contentType) {
    case contentTypes.TASKS_AND_ACTIVITIES:
    case contentTypes.ASSESSMENT_RESOURCES:
    case contentTypes.EXTERNAL:
      return "brand2";
    default:
      return "brand1";
  }
};

const listItemRecipe = cva({
  base: {
    _currentPage: {
      background: "var(--background-current)",
      color: "var(--color-current-hover)",
      borderColor: "var(--border-color-current)",
      position: "relative",

      _before: {
        content: "''",
        position: "absolute",
        borderInline: "6px solid",
        borderColor: "var(--border-color-current)",
        bottom: "-1px",
        top: "-1px",
        left: "0",
        width: "100%",
      },

      _hover: {
        background: "var(--background-hover)",
        color: "text.default",
        _before: {
          display: "none",
        },
      },
      _highlighted: {
        background: "var(--background-hover)",
        color: "text.default",
      },
      "& a:focus-visible": {
        _focusVisible: {
          outlineColor: "var(--color-current-hover)",
        },
      },
      "& button:focus-visible": {
        _focusVisible: {
          boxShadowColor: "var(--color-current-hover)",
        },
      },
    },
    mobileWideDown: {
      "& picture": {
        display: "none",
      },
    },
  },
  defaultVariants: { colorTheme: "brand1" },
  variants: {
    colorTheme: {
      brand1: {
        "--background-current": "colors.surface.action.brand.1.selected",
        "--color-current-hover": "colors.text.default",
      },
      brand2: {
        "--background-current": "colors.surface.action.brand.2.selected",
        "--color-current-hover": "colors.text.default",
      },
      brand3: {
        "--background-current": "colors.surface.action.myNdla.current",
        "--color-current-hover": "colors.text.default",
      },
    },
  },
});

const StyledListItemHeading = styled(ListItemHeading, {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "xxsmall",
    wordWrap: "anywhere",
    lineClamp: "2",
    _currentPage: {
      fontWeight: "bold",
      textDecoration: "none",
    },
  },
});

const StyledListItemImage = styled(ListItemImage, {
  base: {
    mobileWideDown: {
      display: "none",
    },
  },
});

export const ResourceItem = ({
  name,
  url,
  contentType,
  active,
  relevanceId,
  showAdditionalResources,
  language,
  article,
  learningpath,
  currentResourceContentType,
  resourceTypes,
}: Props & Resource) => {
  const additional = relevanceId !== RELEVANCE_CORE;
  const hidden = additional ? !showAdditionalResources : false;

  const listItemTraits = useListItemTraits({ resourceTypes, relevanceId, traits: article?.traits, contentType });

  const describedBy = useMemo(() => {
    const elements = [];
    if (showAdditionalResources) {
      elements.push(relevanceId);
    }
    return elements.length ? elements.join(" ") : undefined;
  }, [relevanceId, showAdditionalResources]);

  if (!learningpath && !article) return null;

  return (
    <li>
      <ListItemRoot
        css={listItemRecipe.raw({ colorTheme: getListItemColorTheme(currentResourceContentType) })}
        context="list"
        colorTheme={getListItemColorTheme(currentResourceContentType)}
        borderVariant={additional ? "dashed" : "solid"}
        aria-current={active ? "page" : undefined}
        hidden={!!hidden && !active}
      >
        <StyledListItemImage
          src={article?.metaImage?.url ?? learningpath?.coverphoto?.url}
          alt=""
          loading="lazy"
          sizes={`(min-width: ${breakpoints.desktop}) 150px, (max-width: ${breakpoints.tablet} ) 100px, 150px`}
          fallbackElement={<ContentTypeFallbackIcon contentType={contentType} />}
        />
        <StyledListItemContent>
          <StyledListItemHeading asChild css={linkOverlay.raw()}>
            <SafeLink
              to={url || ""}
              lang={language}
              aria-current={active ? "page" : undefined}
              title={name}
              aria-describedby={describedBy}
            >
              {name}
            </SafeLink>
          </StyledListItemHeading>
          <BadgesContainer>
            {listItemTraits.map((trait) => (
              <Badge key={`${url}-${trait}`}>{trait}</Badge>
            ))}
          </BadgesContainer>
        </StyledListItemContent>
      </ListItemRoot>
    </li>
  );
};
