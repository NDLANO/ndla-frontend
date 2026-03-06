/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { breakpoints } from "@ndla/core";
import { Badge, ListItemContent, ListItemHeading, ListItemImage, ListItemRoot, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ImageVariantDTO } from "@ndla/types-backend/image-api";
import { BadgesContainer } from "@ndla/ui";
import { ContentTypeFallbackIcon } from "../../components/ContentTypeFallbackIcon";
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
  resource: GQLResourceItem_NodeFragment;
}

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

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
  },
});

export const ResourceItem = ({ resource }: Props) => {
  const listItemTraits = useListItemTraits({
    resourceTypes: resource.resourceTypes,
    relevanceId: resource.relevanceId,
    traits: resource.article?.traits,
  });

  if (!resource.learningpath && !resource.article) return null;

  return (
    <ListItemRoot asChild consumeCss>
      <li>
        {!resource.learningpath && (
          <StyledListItemImage
            src={resource.article?.metaImage?.image.imageUrl}
            alt=""
            loading="lazy"
            sizes={`(min-width: ${breakpoints.desktop}) 150px, (max-width: ${breakpoints.tablet} ) 100px, 150px`}
            width={resource.article?.metaImage?.image.dimensions?.width}
            height={resource.article?.metaImage?.image.dimensions?.height}
            variants={resource.article?.metaImage?.image.variants as ImageVariantDTO[]}
            isFallback={!resource.article?.metaImage?.image.imageUrl}
            fallbackElement={<ContentTypeFallbackIcon />}
          />
        )}
        <StyledListItemContent>
          <TextWrapper>
            <StyledListItemHeading asChild css={linkOverlay.raw()}>
              <SafeLink to={resource.url || ""} lang={resource.language} title={resource.name}>
                {resource.name}
              </SafeLink>
            </StyledListItemHeading>
            {!!resource.learningpath?.description.length && <Text>{resource.learningpath.description}</Text>}
          </TextWrapper>
          <BadgesContainer>
            {listItemTraits.map((trait) => (
              <Badge size="small" key={`${resource.url}-${trait}`}>
                {trait}
              </Badge>
            ))}
          </BadgesContainer>
        </StyledListItemContent>
      </li>
    </ListItemRoot>
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
        description
      }
    }
  `,
};
