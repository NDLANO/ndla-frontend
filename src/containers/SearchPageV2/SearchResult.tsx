/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { gql } from "@apollo/client";
import { ListItemHeading, ListItemRoot, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ContentTypeBadge, constants } from "@ndla/ui";
import { GQLSearchResult_SearchResultFragment } from "../../graphqlTypes";

interface Props {
  searchResult: GQLSearchResult_SearchResultFragment;
}

const StyledListItemRoot = styled(ListItemRoot, {
  base: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
});

export const SearchResult = ({ searchResult }: Props) => {
  const context = searchResult.contexts[0];
  return (
    <StyledListItemRoot asChild consumeCss context="list">
      <li>
        <ListItemHeading asChild consumeCss fontWeight="bold">
          <SafeLink to={searchResult.url} unstyled css={linkOverlay.raw()}>
            {parse(searchResult.htmlTitle)}
          </SafeLink>
        </ListItemHeading>
        {!!searchResult.metaDescription && <Text textStyle="body.large">{searchResult.metaDescription}</Text>}
        {!!context && (
          <>
            <Text color="text.subtle" textStyle="label.small">
              {context.breadcrumbs.join(" > ")}
            </Text>
            <ContentTypeBadge
              contentType={constants.contentTypeMapping?.[context?.resourceTypes?.[0]?.id ?? "default"]}
            />
          </>
        )}
      </li>
    </StyledListItemRoot>
  );
};

SearchResult.fragments = {
  searchResult: gql`
    fragment SearchResult_SearchResult on SearchResult {
      id
      url
      htmlTitle
      metaDescription
      contexts {
        contextId
        url
        breadcrumbs
        resourceTypes {
          id
          name
        }
      }
    }
  `,
};
