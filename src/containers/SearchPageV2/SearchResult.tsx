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
import { linkOverlay } from "@ndla/styled-system/patterns";
import { GQLSearchResult_GroupSearchResultFragment } from "../../graphqlTypes";

interface Props {
  groupSearchResult: GQLSearchResult_GroupSearchResultFragment;
}

export const SearchResult = ({ groupSearchResult }: Props) => {
  return (
    <ListItemRoot asChild consumeCss>
      <li>
        <ListItemHeading asChild>
          <SafeLink to={groupSearchResult.url} unstyled css={linkOverlay.raw()}>
            {parse(groupSearchResult.htmlTitle)}
          </SafeLink>
        </ListItemHeading>
        {!!groupSearchResult.ingress && <Text>{parse(groupSearchResult.ingress)}</Text>}
        {/* TODO: Breadcrumbs */}
        {/* TODO: Content type */}
      </li>
    </ListItemRoot>
  );
};

SearchResult.fragments = {
  groupSearchResult: gql`
    fragment SearchResult_GroupSearchResult on GroupSearchResult {
      id
      url
      htmlTitle
      ingress
      contexts {
        url
        breadcrumbs
      }
    }
  `,
};
