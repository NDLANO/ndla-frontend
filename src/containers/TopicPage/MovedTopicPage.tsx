/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { Heading, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker } from "@ndla/tracker";
import { PageContainer } from "../../components/Layout/PageContainer";
import { MovedNodeCard } from "../../components/MovedNodeCard";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import {
  GQLArticleSearchResult,
  GQLLearningpathSearchResult,
  GQLMovedTopicPage_NodeFragment,
} from "../../graphqlTypes";

interface GQLSearchResultExtended
  extends Omit<
    GQLLearningpathSearchResult | GQLArticleSearchResult,
    "id" | "contexts" | "metaDescription" | "supportedLanguages" | "traits"
  > {
  subjects?: {
    url?: string;
    title: string;
    breadcrumb: string[];
  }[];
  breadcrumbs: string[];
  ingress: string;
  id: string;
  contentType: string;
}

const convertNodeToResult = (node: GQLMovedTopicPage_NodeFragment): GQLSearchResultExtended => ({
  metaImage: node.meta?.metaImage,
  title: node.name,
  htmlTitle: node.name,
  url: node.url || "",
  id: node.id,
  ingress: node.meta?.metaDescription ?? "",
  breadcrumbs: node.breadcrumbs,
  subjects: node.contexts?.map((context) => ({
    url: context.url,
    title: context.name,
    breadcrumb: context.breadcrumbs,
  })),
  contentType: "topic",
});

const mergeTopicSubjects = (results: GQLSearchResultExtended[]) => {
  // Must have at least one result in order to get here. One with url has active context.
  const firstResult = results.find((res) => !!res.url);
  if (!firstResult) {
    return [];
  }
  // Assuming that first element has the same values that the rest of the elements in the results array
  return [
    {
      ...firstResult,
      subjects: results.flatMap((topic: GQLSearchResultExtended) => topic.subjects ?? []),
    },
  ];
};

interface Props {
  nodes: GQLMovedTopicPage_NodeFragment[];
}

const StyledPageContainer = styled(PageContainer, {
  base: {
    gap: "xxlarge",
  },
});

const SearchResultListWrapper = styled("ul", {
  base: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "xsmall",
  },
});

const StyledHeading = styled(Heading, {
  base: {
    textAlign: "center",
  },
});

export const MovedTopicPage = ({ nodes }: Props) => {
  const { t } = useTranslation();
  const nodeAsResults = nodes.map(convertNodeToResult);
  const results = mergeTopicSubjects(nodeAsResults);

  return (
    <StyledPageContainer asChild consumeCss>
      <main>
        <HelmetWithTracker title={t("htmlTitles.movedResourcePage")}>
          <meta name="robots" content="noindex" />
        </HelmetWithTracker>
        <StyledHeading id={SKIP_TO_CONTENT_ID} textStyle="heading.large">
          {results.length ? t("movedResourcePage.title") : t("searchPage.searchResultListMessages.noResultDescription")}
        </StyledHeading>
        {results.length ? (
          <SearchResultListWrapper>
            {results.map((result) => (
              <li key={result.id}>
                <MovedNodeCard
                  title={result.title}
                  breadcrumbs={result.breadcrumbs}
                  url={result.url}
                  ingress={result.ingress}
                  contentType={result.contentType}
                  metaImage={result.metaImage}
                />
              </li>
            ))}
          </SearchResultListWrapper>
        ) : (
          <Text>{t("searchPage.searchResultListMessages.noResultDescription")}</Text>
        )}
      </main>
    </StyledPageContainer>
  );
};

MovedTopicPage.fragments = {
  node: gql`
    fragment MovedTopicPage_Node on Node {
      id
      name
      url
      breadcrumbs
      meta {
        metaDescription
        metaImage {
          url
          alt
        }
      }
      contexts {
        contextId
        url
        name
        breadcrumbs
      }
    }
  `,
};
