/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { breakpoints } from "@ndla/core";
import { PresentationLine } from "@ndla/icons/common";
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
import { HStack, styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ContentType, ContentTypeBadgeNew, constants } from "@ndla/ui";
import { ContentTypeFallbackIcon } from "../../components/ContentTypeFallbackIcon";
import { useEnablePrettyUrls } from "../../components/PrettyUrlsContext";
import { RELEVANCE_CORE } from "../../constants";

const { contentTypes } = constants;

const StyledPresentationLine = styled(PresentationLine, {
  base: {
    position: "relative",
  },
});

const StyledSafeLink = styled(SafeLink, {
  base: {
    wordWrap: "anywhere",
    lineClamp: "2",
    _currentPage: {
      fontWeight: "bold",
      textDecoration: "none",
    },
  },
});

const StyledListItemContent = styled(ListItemContent, {
  base: {
    flexWrap: "wrap",
  },
});

const InfoContainer = styled(HStack, {
  base: {
    marginInlineStart: "auto",
    flexShrink: "0",
  },
});

interface Props {
  id: string;
  showContentTypeDescription?: boolean;
  extraBottomMargin?: boolean;
  showAdditionalResources?: boolean;
  language?: string;
  access?: "teacher";
  currentResourceContentType?: ContentType;
}

export type Resource = {
  id: string;
  name: string;
  path?: string;
  url?: string;
  contentType?: string;
  active?: boolean;
  relevanceId?: string;
  article?: {
    metaImage?: { url?: string; alt?: string };
  };
  learningpath?: {
    coverphoto?: { url?: string };
  };
};

const getListItemColorTheme = (contentType?: ContentType): NonNullable<ListItemVariantProps["colorTheme"]> => {
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

const StyledListItemImage = styled(ListItemImage, {
  base: {
    mobileWideDown: {
      display: "none",
    },
  },
});

export const ResourceItem = ({
  name,
  path,
  url,
  contentType,
  active,
  relevanceId,
  showAdditionalResources,
  access,
  language,
  article,
  learningpath,
  currentResourceContentType,
}: Props & Resource) => {
  const { t } = useTranslation();
  const enablePrettyUrls = useEnablePrettyUrls();
  const relevanceElId = useId();
  const accessId = useId();
  const additional = relevanceId !== RELEVANCE_CORE;
  const hidden = additional ? !showAdditionalResources : false;
  const teacherOnly = access === "teacher";
  const additionalLabel = t("resource.tooltipAdditionalTopic");

  const describedBy = useMemo(() => {
    const elements = [];
    if (teacherOnly) {
      elements.push(accessId);
    }
    if (showAdditionalResources) {
      elements.push(relevanceId);
    }
    return elements.length ? elements.join(" ") : undefined;
  }, [accessId, relevanceId, showAdditionalResources, teacherOnly]);

  return (
    <li>
      <ListItemRoot
        css={listItemRecipe.raw({ colorTheme: getListItemColorTheme(currentResourceContentType) })}
        context="list"
        colorTheme={getListItemColorTheme(currentResourceContentType)}
        borderVariant={additional ? "dashed" : "solid"}
        aria-current={active ? "page" : undefined}
        hidden={hidden && !active}
      >
        <StyledListItemImage
          src={article?.metaImage?.url ?? learningpath?.coverphoto?.url ?? ""}
          alt=""
          sizes={`(min-width: ${breakpoints.desktop}) 150px, (max-width: ${breakpoints.tablet} ) 100px, 150px`}
          fallbackElement={<ContentTypeFallbackIcon contentType={contentType} />}
        />
        <StyledListItemContent>
          <ListItemHeading asChild consumeCss>
            <StyledSafeLink
              to={(enablePrettyUrls ? url : path) || ""}
              unstyled
              css={linkOverlay.raw()}
              lang={language === "nb" ? "no" : language}
              aria-current={active ? "page" : undefined}
              title={name}
              aria-describedby={describedBy}
            >
              {name}
            </StyledSafeLink>
          </ListItemHeading>
          <InfoContainer gap="xxsmall">
            {teacherOnly && (
              <StyledPresentationLine
                aria-hidden={false}
                id={accessId}
                aria-label={t("article.access.onlyTeacher")}
                title={t("article.access.onlyTeacher")}
              />
            )}
            <ContentTypeBadgeNew contentType={contentType} />
            {!!showAdditionalResources && additional && <Badge id={relevanceElId}>{additionalLabel}</Badge>}
          </InfoContainer>
        </StyledListItemContent>
      </ListItemRoot>
    </li>
  );
};
