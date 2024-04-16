/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client/core";

export const contributorInfoFragment = gql`
  fragment ContributorInfo on Contributor {
    name
    type
  }
`;

export const searchFilmQuery = gql`
  fragment SearchFilmArticleSearchResult on ArticleSearchResult {
    id
    url
    metaDescription
    metaImage {
      url
      alt
    }
    title
    contexts {
      breadcrumbs
      relevance
      relevanceId
      language
      contextType
      path
      resourceTypes {
        id
        name
        language
      }
      root
    }
    supportedLanguages
    traits
  }
  fragment SearchFilmLearningpathSearchResult on LearningpathSearchResult {
    id
    url
    metaDescription
    metaImage {
      url
      alt
    }
    title
    contexts {
      breadcrumbs
      relevance
      relevanceId
      language
      contextType
      path
      resourceTypes {
        id
        name
        language
      }
      root
    }
    supportedLanguages
    traits
  }
  query SearchWithoutPagination(
    $query: String
    $contextTypes: String
    $language: String
    $ids: [Int!]
    $resourceTypes: String
    $contextFilters: String
    $sort: String
    $fallback: String
    $subjects: String
    $languageFilter: String
    $relevance: String
  ) {
    searchWithoutPagination(
      query: $query
      contextTypes: $contextTypes
      language: $language
      ids: $ids
      resourceTypes: $resourceTypes
      contextFilters: $contextFilters
      sort: $sort
      fallback: $fallback
      subjects: $subjects
      languageFilter: $languageFilter
      relevance: $relevance
    ) {
      results {
        ... on ArticleSearchResult {
          ...SearchFilmArticleSearchResult
        }
        ... on LearningpathSearchResult {
          ...SearchFilmLearningpathSearchResult
        }
      }
    }
  }
`;

export const GroupSearchResourceFragment = gql`
  fragment GroupSearchResource on GroupSearchResult {
    id
    path
    name
    ingress
    traits
    contexts {
      language
      path
      breadcrumbs
      rootId
      root
      relevance
      relevanceId
      resourceTypes {
        id
        name
      }
    }
    metaImage {
      url
      alt
    }
  }
`;

export const groupSearchQuery = gql`
  query GroupSearch(
    $resourceTypes: String
    $contextTypes: String
    $subjects: String
    $query: String
    $page: Int
    $pageSize: Int
    $language: String
    $fallback: String
    $grepCodes: String
    $aggregatePaths: [String!]
    $grepCodesList: [String]
    $filterInactive: Boolean
  ) {
    groupSearch(
      resourceTypes: $resourceTypes
      contextTypes: $contextTypes
      subjects: $subjects
      query: $query
      page: $page
      pageSize: $pageSize
      language: $language
      fallback: $fallback
      grepCodes: $grepCodes
      aggregatePaths: $aggregatePaths
      filterInactive: $filterInactive
    ) {
      resources {
        ...GroupSearchResource
      }
      aggregations {
        values {
          value
        }
      }
      suggestions {
        suggestions {
          options {
            text
          }
        }
      }
      resourceType
      totalCount
      language
    }
    competenceGoals(codes: $grepCodesList, language: $language) {
      id
      name: title
      type
      curriculum {
        id
        title
      }
      competenceGoalSet {
        id
        title
      }
    }
    coreElements(codes: $grepCodesList, language: $language) {
      id
      title
      text: description
    }
  }
  ${GroupSearchResourceFragment}
`;

export const copyrightInfoFragment = gql`
  ${contributorInfoFragment}
  fragment CopyrightInfo on Copyright {
    license {
      license
      url
      description
    }
    creators {
      ...ContributorInfo
    }
    processors {
      ...ContributorInfo
    }
    rightsholders {
      ...ContributorInfo
    }
    origin
  }
`;

export const subjectInfoFragment = gql`
  fragment SubjectInfo on Subject {
    id
    name
    path
    metadata {
      customFields
    }
    subjectpage {
      id
      about {
        title
      }
      banner {
        desktopUrl
      }
    }
  }
`;

export const searchPageQuery = gql`
  query searchPage {
    subjects(filterVisible: true) {
      ...SubjectInfo
    }
    resourceTypes {
      id
      name
      subtypes {
        id
        name
      }
    }
  }
  ${subjectInfoFragment}
`;

export const movedResourceQuery = gql`
  query movedResource($resourceId: String!) {
    resource(id: $resourceId) {
      contexts {
        path
        breadcrumbs
      }
    }
  }
`;

export const competenceGoalsQuery = gql`
  query competenceGoals($codes: [String!], $language: String) {
    competenceGoals(codes: $codes, language: $language) {
      id
      name: title
      type
      curriculum {
        id
        title
      }
      competenceGoalSet {
        id
        title
      }
    }
    coreElements(codes: $codes, language: $language) {
      id
      name: title
      text: description
      curriculum {
        id
        title
      }
    }
  }
`;

export const movieFragment = gql`
  fragment MovieInfo on Movie {
    id
    title
    metaImage {
      alt
      url
    }
    metaDescription
    resourceTypes {
      id
      name
    }
    path
  }
`;

export const alertsQuery = gql`
  query alerts {
    alerts {
      title
      body
      closable
      number
    }
  }
`;

export const embedOembedQuery = gql`
  query embedOembed($id: String!, $type: String!) {
    resourceEmbed(id: $id, type: $type) {
      meta {
        images {
          title
        }
        concepts {
          title
        }
        audios {
          title
        }
        podcasts {
          title
        }
        brightcoves {
          title
        }
      }
    }
  }
`;
