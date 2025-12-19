/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { breakpoints } from "@ndla/core";
import { Badge, ListItemContent, ListItemHeading, ListItemImage, ListItemRoot } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ImageVariantDTO } from "@ndla/types-backend/image-api";
import { BadgesContainer } from "@ndla/ui";
import { ContentTypeFallbackIcon } from "../../components/ContentTypeFallbackIcon";
import { RELEVANCE_CORE } from "../../constants";
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

export const ResourceItem = ({ active, showAdditionalResources, resource }: Props) => {
  const additional = resource.relevanceId !== RELEVANCE_CORE;
  const hidden = additional ? !showAdditionalResources : false;

  const listItemTraits = useListItemTraits({
    resourceTypes: resource.resourceTypes,
    relevanceId: resource.relevanceId,
    traits: resource.article?.traits,
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
          src={resource.article?.metaImage?.image.imageUrl ?? resource.learningpath?.coverphoto?.image.imageUrl}
          alt=""
          loading="lazy"
          sizes={`(min-width: ${breakpoints.desktop}) 150px, (max-width: ${breakpoints.tablet} ) 100px, 150px`}
          width={resource.article?.metaImage?.image.dimensions?.width}
          height={resource.article?.metaImage?.image.dimensions?.height}
          variants={resource.article?.metaImage?.image.variants as ImageVariantDTO[]}
          isFallback={
            !resource.article?.metaImage?.image.imageUrl && !resource.learningpath?.coverphoto?.image.imageUrl
          }
          fallbackElement={<ContentTypeFallbackIcon />}
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
          image {
            variants {
              size
              variantUrl
            }
            dimensions {
              width
              height
            }
            imageUrl
          }
          alttext {
            alttext
          }
        }
        traits
      }
      learningpath {
        id
        coverphoto {
          image {
            variants {
              size
              variantUrl
            }
            dimensions {
              width
              height
            }
            imageUrl
          }
        }
      }
    }
  `,
};
