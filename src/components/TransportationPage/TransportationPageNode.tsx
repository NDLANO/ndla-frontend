/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { Additional } from "@ndla/icons";
import { CardContent, CardHeading, CardImage, CardRoot, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { useTranslation } from "react-i18next";
import { RELEVANCE_SUPPLEMENTARY } from "../../constants";
import { GQLTransportationNode_NodeFragment } from "../../graphqlTypes";
import { ContentTypeFallbackIcon } from "../ContentTypeFallbackIcon";

interface Props {
  node: GQLTransportationNode_NodeFragment;
  context: "case" | "link" | "node";
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

export const TransportationNode = ({ node, context }: Props) => {
  const { t } = useTranslation();
  const parent = node.context?.breadcrumbs?.at(-2);
  return (
    <CardRoot asChild consumeCss>
      <li>
        {!!(context !== "node" && !!node.meta?.metaImage) && (
          <CardImage
            // TODO: Variants
            src={node.meta.metaImage.url}
            alt=""
            height={200}
            fallbackWidth={360}
            fallbackElement={<ContentTypeFallbackIcon />}
          />
        )}
        <CardContent>
          <TextWrapper>
            {context === "link" && (
              <Text textStyle="label.medium" color="text.subtle">
                {parent}
              </Text>
            )}
            <StyledCardHeading asChild css={linkOverlay.raw()}>
              <SafeLink to={node.url ?? ""}>
                {node.name}
                {node.relevanceId === RELEVANCE_SUPPLEMENTARY && (
                  <Additional aria-label={t("resource.additionalTooltip")} title={t("resource.additionalTooltip")} />
                )}
              </SafeLink>
            </StyledCardHeading>
          </TextWrapper>
          {context !== "link" && <StyledText textStyle="body.large">{node.meta?.metaDescription ?? ""}</StyledText>}
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
