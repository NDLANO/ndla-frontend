/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Additional, Core, PresentationLine } from "@ndla/icons/common";
import { ListItemContent, ListItemHeading, ListItemRoot } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { HStack, styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ContentTypeBadgeNew } from "@ndla/ui";
import { RELEVANCE_CORE } from "../../constants";

// TODO: How should we handle additional resources?
// TODO: What should teacher only look like?
// TODO: What should we do with current indicator? Should we keep "you are here" / the dot before the list item?
// TODO: Figure out if we NEED to show the meta image. This would force us to fetch n articles.

const StyledAdditional = styled(Additional, {
  base: {
    position: "relative",
    color: "icon.strong",
  },
});

const StyledCore = styled(Core, {
  base: {
    position: "relative",
    color: "icon.strong",
  },
});

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

  const RelevanceIcon = useMemo(() => {
    if (!showAdditionalResources) return null;
    return additional ? StyledAdditional : StyledCore;
  }, [additional, showAdditionalResources]);

  const describedBy = useMemo(() => {
    const elements = [];
    if (teacherOnly) {
      elements.push(accessId);
    }
    if (RelevanceIcon) {
      elements.push(relevanceId);
    }
    return elements.length ? elements.join(" ") : undefined;
  }, [RelevanceIcon, accessId, relevanceId, teacherOnly]);

  return (
    <ListItemRoot
      variant="list"
      aria-current={active ? "page" : undefined}
      hidden={hidden && !active}
      asChild
      consumeCss
    >
      <li>
        <StyledListItemContent>
          <ListItemHeading asChild consumeCss>
            <StyledSafeLink
              to={path}
              unstyled
              css={linkOverlay.raw()}
              lang={language === "nb" ? "no" : language}
              aria-current={active ? "page" : undefined}
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
            {!!RelevanceIcon && (
              <RelevanceIcon
                aria-hidden={false}
                id={relevanceElId}
                aria-label={contentTypeDescription}
                title={contentTypeDescription}
              />
            )}
          </InfoContainer>
        </StyledListItemContent>
      </li>
    </ListItemRoot>
  );
};
