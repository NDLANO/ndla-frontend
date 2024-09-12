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
import { HStack, styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ContentType, ContentTypeBadgeNew, constants } from "@ndla/ui";
import ListItemImageFallback from "../../components/ListItemImageFallback";
import { RELEVANCE_CORE } from "../../constants";

const { contentTypes } = constants;

// TODO: Figure out if we NEED to show the meta image. This would force us to fetch n articles.

const StyledPresentationLine = styled(PresentationLine, {
  base: {
    position: "relative",
  },
});

const StyledSafeLink = styled(SafeLink, {
  base: {
    wordWrap: "anywhere",
    mobileWide: {
      lineClamp: "1",
    },
  },
});

const StyledListItemContent = styled(ListItemContent, {
  base: {
    mobileWideDown: {
      flexDirection: "column",
    },
  },
});

const TitleWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "small",
  },
});

const InfoContainer = styled(HStack, {
  base: {
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
  path: string;
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

export const ResourceItem = ({
  name,
  path,
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
  const relevanceElId = useId();
  const accessId = useId();
  const additional = relevanceId !== RELEVANCE_CORE;
  const hidden = additional ? !showAdditionalResources : false;
  const teacherOnly = access === "teacher";
  const contentTypeDescription = additional ? t("resource.tooltipAdditionalTopic") : t("resource.tooltipCoreTopic");

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
        variant="list"
        colorTheme={getListItemColorTheme(currentResourceContentType)}
        borderVariant={additional ? "dashed" : "solid"}
        aria-current={active ? "page" : undefined}
        hidden={hidden && !active}
      >
        <StyledListItemContent>
          <TitleWrapper>
            {(article && article?.metaImage?.url !== undefined) ||
            (learningpath && learningpath?.coverphoto?.url !== undefined) ? (
              <ListItemImage
                src={article?.metaImage?.url ?? learningpath?.coverphoto?.url ?? ""}
                alt={article?.metaImage?.alt ?? ""}
                sizes={`(min-width: ${breakpoints.desktop}) 150px, (max-width: ${breakpoints.tablet} ) 100px, 150px`}
              />
            ) : (
              <ListItemImageFallback iconSize="small" />
            )}
            <ListItemHeading asChild consumeCss>
              <StyledSafeLink
                to={path}
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
          </TitleWrapper>
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
            {!!showAdditionalResources && <Badge id={relevanceElId}>{contentTypeDescription}</Badge>}
          </InfoContainer>
        </StyledListItemContent>
      </ListItemRoot>
    </li>
  );
};
