/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { breakpoints } from "@ndla/core";
import { Badge, ListItemContent, ListItemHeading, ListItemImage, ListItemRoot } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { BadgesContainer } from "@ndla/ui";
import { ContentTypeFallbackIcon } from "../../components/ContentTypeFallbackIcon";
import config from "../../config";
import { RELEVANCE_CORE, RELEVANCE_SUPPLEMENTARY } from "../../constants";
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

const StyledListItemRoot = styled(ListItemRoot, {
  base: {
    _currentPage: {
      borderColor: "stroke.hover",
      _after: {
        content: "''",
        position: "absolute",
        insetBlock: "-1px",
        insetInlineStart: "-4px",
        borderInlineStart: "8px solid",
        borderInlineStartColor: "stroke.hover",
        transitionProperty: "border-color, border-width",
        transitionDuration: "superFast",
        transitionTimingFunction: "ease-in-out",
      },
    },
  },
});

const StyledListItemHeading = styled(ListItemHeading, {
  base: {
    wordWrap: "anywhere",
    lineClamp: "2",
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
  resourceTypes,
}: Props & Resource) => {
  const { t } = useTranslation();
  const additional = relevanceId !== RELEVANCE_CORE;
  const hidden = additional ? !showAdditionalResources : false;

  const listItemTraits = useListItemTraits({ resourceTypes, relevanceId, traits: article?.traits, contentType });

  if (!learningpath && !article) return null;

  return (
    <StyledListItemRoot
      aria-current={active ? "page" : undefined}
      hidden={!!hidden && !active}
      nonInteractive={active}
      asChild
      consumeCss
    >
      <li>
        <StyledListItemImage
          src={article?.metaImage?.url ?? learningpath?.coverphoto?.url}
          alt=""
          loading="lazy"
          sizes={`(min-width: ${breakpoints.desktop}) 150px, (max-width: ${breakpoints.tablet} ) 100px, 150px`}
          fallbackElement={<ContentTypeFallbackIcon contentType={contentType} />}
        />
        <StyledListItemContent>
          <StyledListItemHeading asChild consumeCss={active} css={active ? undefined : linkOverlay.raw()}>
            {active ? (
              <p>{name}</p>
            ) : (
              <SafeLink to={url || ""} lang={language} title={name}>
                {name}
              </SafeLink>
            )}
          </StyledListItemHeading>
          <BadgesContainer>
            {listItemTraits.map((trait) => (
              <Badge key={`${url}-${trait}`}>{trait}</Badge>
            ))}
            {!config.allResourceTypesEnabled && relevanceId === RELEVANCE_SUPPLEMENTARY ? (
              <Badge>{t("resource.tooltipAdditionalTopic")}</Badge>
            ) : undefined}
          </BadgesContainer>
        </StyledListItemContent>
      </li>
    </StyledListItemRoot>
  );
};
