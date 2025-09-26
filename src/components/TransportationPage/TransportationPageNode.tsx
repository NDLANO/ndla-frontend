/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { Additional } from "@ndla/icons";
import { Heading, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { TransportationPageListItem } from "./TransportationpageListItem";
import { RELEVANCE_SUPPLEMENTARY } from "../../constants";
import { GQLTransportationNode_NodeFragment } from "../../graphqlTypes";

interface Props {
  node: GQLTransportationNode_NodeFragment;
}

const StyledHeading = styled(Heading, {
  base: {
    textDecoration: "underline",
    _hover: {
      textDecoration: "none",
    },
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
    <TransportationPageListItem>
      <StyledHeading asChild consumeCss textStyle="title.small">
        <SafeLink to={node.url ?? ""} unstyled css={linkOverlay.raw()}>
          {node.name}
          {node.relevanceId === RELEVANCE_SUPPLEMENTARY && (
            <StyledAdditional aria-label={t("resource.additionalTooltip")} title={t("resource.additionalTooltip")} />
          )}
        </SafeLink>
      </StyledHeading>
      {!!node.meta?.metaDescription?.length && <Text textStyle="body.large">{node.meta.metaDescription}</Text>}
    </TransportationPageListItem>
  );
};

TransportationNode.fragments = {
  node: gql`
    fragment TransportationNode_Node on Node {
      id
      name
      url
      relevanceId
      meta {
        metaDescription
      }
    }
  `,
};
