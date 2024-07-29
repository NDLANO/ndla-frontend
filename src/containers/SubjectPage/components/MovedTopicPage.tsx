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
import { OneColumn } from "@ndla/ui";
import { MovedNodeCard } from "../../../components/MovedNodeCard";
import { GQLMovedTopicPage_TopicFragment, GQLSearchResult } from "../../../graphqlTypes";

interface GQLSearchResultExtended
  extends Omit<GQLSearchResult, "id" | "contexts" | "metaDescription" | "supportedLanguages" | "traits"> {
  subjects?: {
    url?: string;
    title: string;
    breadcrumb: string[];
  }[];
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

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "xsmall",
    paddingBlock: "medium",
  },
});

const SearchResultListWrapper = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const MovedTopicPage = ({ topics }: Props) => {
  const { t } = useTranslation();
  const topicsAsResults = topics.map(convertTopicToResult);
  const results = mergeTopicSubjects(topicsAsResults);

  return (
    <OneColumn>
      <Wrapper>
        <Heading>
          {results.length ? t("movedResourcePage.title") : t("searchPage.searchResultListMessages.noResultDescription")}
        </Heading>
        {results.length ? (
          <SearchResultListWrapper>
            {results.map((result) => (
              <li key={result.id}>
                <MovedNodeCard
                  title={result.title}
                  url={result.url}
                  ingress={result.ingress}
                  contentType={result.contentType}
                  metaImage={result.metaImage}
                  subjects={result.subjects}
                />
              </li>
            ))}
          </SearchResultListWrapper>
        ) : (
          <Text>{t("searchPage.searchResultListMessages.noResultDescription")}</Text>
        )}
      </Wrapper>
    </OneColumn>
  );
};

MovedTopicPage.fragments = {
  topic: gql`
    fragment MovedTopicPage_Topic on Topic {
      id
      path
      name
      meta {
        metaDescription
        metaImage {
          url
          alt
        }
      }
      contexts {
        breadcrumbs
      }
    }
  `,
};

export default MovedTopicPage;
