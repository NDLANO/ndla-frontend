/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { Additional, PresentationLine } from "@ndla/icons";
import { Heading, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { RELEVANCE_SUPPLEMENTARY } from "../../constants";
import { GQLTransportationNode_NodeFragment } from "../../graphqlTypes";

interface Props {
  node: GQLTransportationNode_NodeFragment;
}

const TopicCard = styled("li", {
  base: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    gap: "3xsmall",
    padding: "medium",
    _after: {
      content: '""',
      bottom: "0",
      position: "absolute",
      width: "100%",
      background: "stroke.subtle",
      height: "1px",
      left: "0",
      transitionProperty: "height, background",
      transitionTimingFunction: "ease-in-out",
      transitionDuration: "superFast",
    },
    _hover: {
      _after: {
        height: "4xsmall",
        background: "stroke.hover",
      },
    },
    _active: {
      background: "surface.active",
    },
  },
});

const StyledHeading = styled(Heading, {
  base: {
    textDecoration: "underline",
    _hover: {
      textDecoration: "none",
    },
  },
});

const StyledPresentationLine = styled(PresentationLine, {
  base: {
    marginInlineEnd: "3xsmall",
  },
});

const StyledAdditional = styled(Additional, {
  base: {
    marginInlineStart: "3xsmall",
  },
});

export const TransportationNode = ({ node }: Props) => {
  const { t } = useTranslation();
  return (
    <TopicCard>
      <StyledHeading asChild consumeCss textStyle="title.small">
        <SafeLink to={node.url ?? ""} unstyled css={linkOverlay.raw()}>
          {/* TODO: Consider adding a label to this */}
          {node.availability !== "everyone" && <StyledPresentationLine />}
          {node.name}
          {node.relevanceId === RELEVANCE_SUPPLEMENTARY && (
            <StyledAdditional aria-label={t("resource.additionalTooltip")} title={t("resource.additionalTooltip")} />
          )}
        </SafeLink>
      </StyledHeading>
      {!!node.meta?.metaDescription?.length && <Text textStyle="body.large">{node.meta.metaDescription}</Text>}
    </TopicCard>
  );
};

TransportationNode.fragments = {
  node: gql`
    fragment TransportationNode_Node on Node {
      id
      name
      path
      url
      availability
      relevanceId
      meta {
        metaDescription
      }
    }
  `,
};
