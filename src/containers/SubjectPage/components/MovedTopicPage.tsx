/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { Heading, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { PageContainer } from "../../../components/Layout/PageContainer";
import { MovedNodeCard } from "../../../components/MovedNodeCard";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { GQLMovedTopicPage_TopicFragment, GQLSearchResult } from "../../../graphqlTypes";

interface GQLSearchResultExtended
  extends Omit<GQLSearchResult, "id" | "contexts" | "metaDescription" | "supportedLanguages" | "traits"> {
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

const convertTopicToResult = (topic: GQLMovedTopicPage_TopicFragment): GQLSearchResultExtended => {
  return {
    metaImage: topic.meta?.metaImage,
    title: topic.name,
    url: topic.path || "",
    id: topic.id,
    ingress: topic.meta?.metaDescription ?? "",
    breadcrumbs: topic.breadcrumbs,
    subjects: topic.contexts?.map(({ breadcrumbs }) => ({
      url: topic.path,
      title: breadcrumbs[0]!,
      breadcrumb: breadcrumbs,
    })),
    contentType: "topic",
  };
};

const mergeTopicSubjects = (results: GQLSearchResultExtended[]) => {
  // Must have at least one result in order to get here.
  const firstResult = results[0]!;
  // Assuming that first element has the same values that the rest of the elements in the results array
  return [
    {
      ...firstResult,
      subjects: results.flatMap((topic: GQLSearchResultExtended) => topic.subjects ?? []),
    },
  ];
};

interface Props {
  topics: GQLMovedTopicPage_TopicFragment[];
}

const StyledMain = styled("main", {
  base: {
    display: "flex",
    gap: "xxlarge",
    flexDirection: "column",
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

const MovedTopicPage = ({ topics }: Props) => {
  const { t } = useTranslation();
  const topicsAsResults = topics.map(convertTopicToResult);
  const results = mergeTopicSubjects(topicsAsResults);

  return (
    <PageContainer>
      <StyledMain>
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
      </StyledMain>
    </PageContainer>
  );
};

MovedTopicPage.fragments = {
  topic: gql`
    fragment MovedTopicPage_Topic on Node {
      id
      name
      path
      url
      name
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
        breadcrumbs
      }
    }
  `,
};

export default MovedTopicPage;
