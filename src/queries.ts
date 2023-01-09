/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';

const contributorInfoFragment = gql`
  fragment ContributorInfo on Contributor {
    name
    type
  }
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
    $contextFilters: String
    $sort: String
    $fallback: String
    $subjects: String
    $languageFilter: String
    $relevance: String
    $grepCodes: String
  ) {
    search(
      query: $query
      page: $page
      pageSize: $pageSize
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
      grepCodes: $grepCodes
    ) {
      language
      page
      pageSize
      results {
        id
        url
        metaDescription
        metaImage {
          url
          alt
        }
        title
        contexts {
          id
          breadcrumbs
          relevance
          language
          learningResourceType
          path
          resourceTypes {
            id
            name
            language
          }
          subject
          subjectId
          relevance
        }
        supportedLanguages
        traits
      }
      suggestions {
        name
        suggestions {
          text
          offset
          length
          options {
            text
            score
          }
        }
      }
      totalCount
    }
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
      language
      learningResourceType
      path
      resourceTypes {
        id
        name
        language
      }
      subject
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
      language
      learningResourceType
      path
      resourceTypes {
        id
        name
        language
      }
      subject
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
      subjectId
      subject
      relevance
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

export const visualElementFragment = gql`
  ${copyrightInfoFragment}
  fragment VisualElementInfo on VisualElement {
    title
    resource
    url
    copyright {
      ...CopyrightInfo
    }
    language
    embed
    brightcove {
      videoid
      player
      account
      caption
      description
      cover
      src
      download
      iframe {
        src
        height
        width
      }
      uploadDate
    }
    h5p {
      src
      thumbnail
    }
    oembed {
      title
      html
      fullscreen
    }
    image {
      resourceid
      alt
      caption
      lowerRightX
      lowerRightY
      upperLeftX
      upperLeftY
      focalX
      focalY
      src
      altText
      contentType
      copyText
    }
  }
`;

export const conceptSearchInfoFragment = gql`
  fragment ConceptSearchConcept on Concept {
    id
    title
    subjectNames
    visualElement {
      ...VisualElementInfo
    }
    copyright {
      license {
        license
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
    text: content
    image: metaImage {
      url
      alt
    }
  }
  ${contributorInfoFragment}
  ${visualElementFragment}
`;
export const frontpageSearchQuery = gql`
  query FrontpageSearch($query: String) {
    frontpageSearch(query: $query) {
      topicResources {
        results {
          id
          name
          path
          resourceTypes {
            name
          }
          subject
        }
        totalCount
        suggestions {
          suggestions {
            options {
              text
              score
            }
          }
        }
      }
      learningResources {
        results {
          id
          name
          path
          resourceTypes {
            name
          }
          subject
        }
        totalCount
        suggestions {
          suggestions {
            options {
              text
              score
            }
          }
        }
      }
    }
  }
`;

export const metaInfoFragment = gql`
  fragment MetaInfo on Meta {
    id
    title
    introduction
    metaDescription
    metaImage {
      url
      alt
    }
    lastUpdated
  }
`;

export const topicInfoFragment = gql`
  fragment TopicInfo on Topic {
    id
    name
    contentUri
    path
    parent
    relevanceId
    supportedLanguages
    meta {
      ...MetaInfo
    }
    metadata {
      customFields
    }
  }
  ${metaInfoFragment}
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
      about {
        title
      }
      banner {
        desktopUrl
      }
    }
  }
`;

export const resourceInfoFragment = gql`
  fragment ResourceInfo on Resource {
    id
    name
    contentUri
    path
    paths
    relevanceId
    rank
    resourceTypes {
      id
      name
    }
  }
`;

export const taxonomyEntityInfo = gql`
  fragment TaxonomyEntityInfo on TaxonomyEntity {
    id
    name
    contentUri
    path
    ... on Resource {
      resourceTypes {
        id
        name
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

export const subjectsQuery = gql`
  query subjects {
    subjects(filterVisible: true) {
      ...SubjectInfo
    }
  }
  ${subjectInfoFragment}
`;

export const movedResourceQuery = gql`
  query movedResource($resourceId: String!) {
    resource(id: $resourceId) {
      breadcrumbs
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

export const mastHeadQuery = gql`
  query mastHead(
    $subjectId: String!
    $topicId: String!
    $resourceId: String!
    $skipSubject: Boolean!
    $skipTopic: Boolean!
    $skipResource: Boolean!
  ) {
    subject(id: $subjectId) @skip(if: $skipSubject) {
      id
      name
      path
      topics(all: true) {
        ...TopicInfo
      }
    }
    resourceTypes {
      id
      name
    }
    topic(id: $topicId, subjectId: $subjectId) @skip(if: $skipTopic) {
      id
      metadata {
        customFields
      }
      coreResources(subjectId: $subjectId) {
        ...ResourceInfo
      }
      supplementaryResources(subjectId: $subjectId) {
        ...ResourceInfo
      }
    }
    resource(id: $resourceId, subjectId: $subjectId, topicId: $topicId)
      @skip(if: $skipResource) {
      ...ResourceInfo
    }
    subjects(filterVisible: true) {
      ...SubjectInfo
    }
  }
  ${topicInfoFragment}
  ${resourceInfoFragment}
  ${subjectInfoFragment}
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
