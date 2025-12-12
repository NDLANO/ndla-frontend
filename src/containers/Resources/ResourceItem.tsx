/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { breakpoints } from "@ndla/core";
import { Badge, ListItemContent, ListItemHeading, ListItemImage, ListItemRoot } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { BadgesContainer } from "@ndla/ui";
import { ContentTypeFallbackIcon } from "../../components/ContentTypeFallbackIcon";
import config from "../../config";
import { RELEVANCE_CORE, RELEVANCE_SUPPLEMENTARY } from "../../constants";
import { GQLResourceItem_NodeFragment } from "../../graphqlTypes";
import { useListItemTraits } from "../../util/listItemTraits";

const StyledListItemContent = styled(ListItemContent, {
  base: {
    flexDirection: "column",
    gap: "small",
    alignItems: "flex-start",
  },
});

interface Props {
  showAdditionalResources?: boolean;
  active?: boolean;
  contentType?: string;
  resource: GQLResourceItem_NodeFragment;
}

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
  variants: {
    isFallback: {
      true: {
        background: "surface.subtle",
        border: "1px solid",
        borderColor: "stroke.discrete",
        borderRadius: "xsmall",
      },
    },
  },
});

export const ResourceItem = ({ contentType, active, showAdditionalResources, resource }: Props) => {
  const { t } = useTranslation();
  const additional = resource.relevanceId !== RELEVANCE_CORE;
  const hidden = additional ? !showAdditionalResources : false;

  const listItemTraits = useListItemTraits({
    resourceTypes: resource.resourceTypes,
    relevanceId: resource.relevanceId,
    traits: resource.article?.traits,
    contentType,
  });

  if (!resource.learningpath && !resource.article) return null;

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
          src={resource.article?.metaImage?.url ?? resource.learningpath?.coverphoto?.url}
          alt=""
          loading="lazy"
          sizes={`(min-width: ${breakpoints.desktop}) 150px, (max-width: ${breakpoints.tablet} ) 100px, 150px`}
          isFallback={!resource.article?.metaImage?.url && !resource.learningpath?.coverphoto?.url}
          fallbackElement={<ContentTypeFallbackIcon contentType={contentType} />}
        />
        <StyledListItemContent>
          <StyledListItemHeading asChild consumeCss={active} css={active ? undefined : linkOverlay.raw()}>
            {active ? (
              <p>{resource.name}</p>
            ) : (
              <SafeLink to={resource.url || ""} lang={resource.language} title={resource.name}>
                {resource.name}
              </SafeLink>
            )}
          </StyledListItemHeading>
          <BadgesContainer>
            {listItemTraits.map((trait) => (
              <Badge size="small" key={`${resource.url}-${trait}`}>
                {trait}
              </Badge>
            ))}
            {!config.allResourceTypesEnabled && resource.relevanceId === RELEVANCE_SUPPLEMENTARY ? (
              <Badge size="small">{t("resource.tooltipAdditionalTopic")}</Badge>
            ) : undefined}
          </BadgesContainer>
        </StyledListItemContent>
      </li>
    </StyledListItemRoot>
  );
};

ResourceItem.fragments = {
  node: gql`
    fragment ResourceItem_Node on Node {
      id
      nodeType
      rank
      name
      url
      language
      relevanceId
      resourceTypes {
        id
        name
      }
      article {
        id
        metaImage {
          url
          alt
        }
        traits
      }
      learningpath {
        id
        coverphoto {
          url
        }
      }
    }
  `,
};
