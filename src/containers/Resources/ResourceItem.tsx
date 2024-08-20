/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PresentationLine } from "@ndla/icons/common";
import { Badge, ListItemContent, ListItemHeading, ListItemRoot } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { HStack, styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ContentTypeBadgeNew } from "@ndla/ui";
import { RELEVANCE_CORE } from "../../constants";

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
}

export type Resource = {
  id: string;
  name: string;
  path: string;
  contentType?: string;
  active?: boolean;
  relevanceId?: string;
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
        colorTheme="brand1"
        borderVariant={additional ? "dashed" : "solid"}
        aria-current={active ? "page" : undefined}
        hidden={hidden && !active}
      >
        <StyledListItemContent>
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
