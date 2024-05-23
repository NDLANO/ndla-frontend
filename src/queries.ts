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
    coreElements(codes: $grepCodesList, language: $language) {
      id
      title
      description
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
