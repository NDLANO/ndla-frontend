/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { CardContent, CardHeading, CardImage, CardRoot, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { useTranslation } from "react-i18next";
import {
  GQLMetaImage,
  GQLTransportationNode_NodeFragment,
  GQLTransportationSearchResult_SearchResultFragment,
} from "../../graphqlTypes";
import { useListItemTraits } from "../../util/listItemTraits";
import { ContentTypeFallbackIcon } from "../ContentTypeFallbackIcon";

type TransportationNodeContext = "case" | "link" | "node";

interface TransportationCardProps {
  metaImage?: GQLMetaImage;
  flavorText?: string;
  name: string;
  url: string;
  relevanceId?: string;
  metaDescription?: string;
  context: TransportationNodeContext;
}

const StyledText = styled(Text, {
  base: {
    flex: "1",
  },
});

const StyledCardHeading = styled(CardHeading, {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
  },
});

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
  },
});

interface Props {
  node: GQLTransportationNode_NodeFragment;
  context: TransportationNodeContext;
}

export const TransportationNode = ({ node, context }: Props) => (
  <TransportationCard
    metaImage={node.meta?.metaImage}
    flavorText={context !== "link" ? node.context?.breadcrumbs?.at(-2) : undefined}
    name={node.name}
    url={node.url ?? ""}
    relevanceId={node.relevanceId}
    metaDescription={node.meta?.metaDescription}
    context={context}
  />
);

interface TransportationSearchResultProps {
  result: GQLTransportationSearchResult_SearchResultFragment;
  context: TransportationNodeContext;
}

export const TransportationSearchResult = ({ result, context }: TransportationSearchResultProps) => {
  const traits = useListItemTraits({
    traits: "traits" in result ? result.traits : undefined,
    resourceType: result.url.startsWith("/e/") ? "topic" : undefined,
    relevanceId: result.context?.relevanceId,
    resourceTypes: result.context?.resourceTypes,
  });
  return (
    <TransportationCard
      metaImage={"metaImage" in result ? result.metaImage : undefined}
      flavorText={traits.join(", ")}
      name={result.title}
      url={result.url}
      relevanceId={result.context?.relevanceId}
      metaDescription={result.metaDescription}
      context={context}
    />
  );
};

TransportationSearchResult.fragments = {
  searchResult: gql`
    fragment TransportationSearchResult_SearchResult on SearchResult {
      id
      title
      url
      metaDescription
      context {
        contextId
        relevanceId
        resourceTypes {
          id
          name
        }
      }
      ... on ArticleSearchResult {
        metaImage {
          url
          alt
        }
        traits
      }
      ... on LearningpathSearchResult {
        metaImage {
          url
          alt
        }
        traits
      }
    }
  `,
};

export const TransportationCard = ({
  metaImage,
  flavorText,
  name,
  url,
  relevanceId,
  metaDescription,
  context,
}: TransportationCardProps) => {
  const { t } = useTranslation();
  return (
    <CardRoot asChild consumeCss>
      <li>
        {!!(context !== "node" && !!metaImage) && (
          <CardImage
            // TODO: Variants
            src={metaImage.url}
            alt=""
            height={200}
            fallbackWidth={360}
            fallbackElement={<ContentTypeFallbackIcon />}
          />
        )}
        <CardContent>
          <TextWrapper>
            {!!flavorText && (
              <Text textStyle="label.medium" color="text.subtle">
                {flavorText}
              </Text>
            )}
            <StyledCardHeading asChild css={linkOverlay.raw()}>
              <SafeLink to={url ?? ""}>
                {name}
              </SafeLink>
            </StyledCardHeading>
          </TextWrapper>
          {context !== "link" && <StyledText textStyle="body.large">{metaDescription ?? ""}</StyledText>}
        </CardContent>
      </li>
    </CardRoot>
  );
};

TransportationNode.fragments = {
  node: gql`
    fragment TransportationNode_Node on Node {
      id
      nodeType
      name
      url
      relevanceId
      meta {
        metaDescription
        metaImage {
          url
          alt
        }
      }
      context {
        contextId
        breadcrumbs
      }
    }
  `,
};
