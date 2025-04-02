/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";

export const contextQuery = gql`
  query Context($contextId: String!) {
    node(contextId: $contextId) {
      id
      nodeType
      context {
        contextId
        rootId
        parentIds
        url
      }
    }
  }
`;

export const contributorInfoFragment = gql`
  fragment ContributorInfo on Contributor {
    name
    type
  }
`;

const searchContextFragment = gql`
  fragment SearchContext on SearchContext {
    contextId
    publicId
    language
    url
    breadcrumbs
    rootId
    root
    relevance
    relevanceId
    resourceTypes {
      id
      name
    }
    isPrimary
  }
`;

const searchResultFragment = gql`
  fragment SearchResource on SearchResult {
    id
    title
    supportedLanguages
    url
    metaDescription
    ... on ArticleSearchResult {
      htmlTitle
      traits
      metaImage {
        url
        alt
      }
    }
    ... on LearningpathSearchResult {
      htmlTitle
      traits
      metaImage {
        url
        alt
      }
    }
    contexts {
      ...SearchContext
    }
  }
  ${searchContextFragment}
`;

export const searchQuery = gql`
  query Search(
    $query: String
    $page: Int
    $pageSize: Int
    $contextTypes: String
    $language: String
    $ids: [Int!]
    $resourceTypes: String
    $levels: String
    $sort: String
    $fallback: String
    $subjects: String
    $languageFilter: String
    $relevance: String
    $grepCodes: String
    $traits: [String!]
    $aggregatePaths: [String!]
    $filterInactive: Boolean
    $license: String
    $resultTypes: String
    $nodeTypes: String
  ) {
    search(
      query: $query
      page: $page
      pageSize: $pageSize
      contextTypes: $contextTypes
      language: $language
      ids: $ids
      resourceTypes: $resourceTypes
      levels: $levels
      sort: $sort
      fallback: $fallback
      subjects: $subjects
      languageFilter: $languageFilter
      relevance: $relevance
      grepCodes: $grepCodes
      traits: $traits
      aggregatePaths: $aggregatePaths
      filterInactive: $filterInactive
      license: $license
      resultTypes: $resultTypes
      nodeTypes: $nodeTypes
    ) {
      pageSize
      page
      language
      totalCount
      results {
        ...SearchResource
      }
      suggestions {
        suggestions {
          options {
            text
          }
        }
      }
      aggregations {
        values {
          value
        }
      }
    }
  }
  ${searchResultFragment}
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
    processed
  }
`;

export const movedResourceQuery = gql`
  query movedResource($resourceId: String!) {
    resource: node(id: $resourceId) {
      contexts {
        contextId
        url
        breadcrumbs
      }
    }
  }
`;

export const competenceGoalsQuery = gql`
  query competenceGoals($codes: [String!], $language: String) {
    competenceGoals(codes: $codes, language: $language) {
      id
      title
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
      title
      description
      curriculum {
        id
        title
      }
    }
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

export const nodeWithMetadataFragment = gql`
  fragment NodeWithMetadata on Node {
    id
    name
    url
    metadata {
      customFields
    }
  }
`;
