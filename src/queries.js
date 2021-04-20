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
    $page: String
    $pageSize: String
    $contextTypes: String
    $language: String
    $ids: String
    $resourceTypes: String
    $contextFilters: String
    $levels: String
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
      levels: $levels
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
          filters {
            id
            name
            relevance
          }
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
  query SearchWithoutPagination(
    $query: String
    $contextTypes: String
    $language: String
    $ids: String
    $resourceTypes: String
    $contextFilters: String
    $levels: String
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
      levels: $levels
      sort: $sort
      fallback: $fallback
      subjects: $subjects
      languageFilter: $languageFilter
      relevance: $relevance
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
          breadcrumbs
          filters {
            name
            relevance
          }
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
      totalCount
    }
  }
`;

export const groupSearchQuery = gql`
  query GroupSearch(
    $resourceTypes: String
    $contextTypes: String
    $subjects: String
    $levels: String
    $query: String
    $page: String
    $pageSize: String
    $language: String
    $fallback: String
    $aggregatePaths: [String]
  ) {
    groupSearch(
      resourceTypes: $resourceTypes
      contextTypes: $contextTypes
      subjects: $subjects
      levels: $levels
      query: $query
      page: $page
      pageSize: $pageSize
      language: $language
      fallback: $fallback
      aggregatePaths: $aggregatePaths
    ) {
      resources {
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
          resourceTypes {
            id
            name
          }
          filters {
            id
            relevance
          }
        }
        metaImage {
          url
          alt
        }
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
  }
`;

export const conceptSearchQuery = gql`
  query ConceptSearch($query: String, $subjects: String, $language: String) {
    conceptSearch(query: $query, subjects: $subjects, language: $language) {
      id
      title
      text: content
      image: metaImage {
        url
        alt
      }
    }
  }
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
          filters {
            id
            name
          }
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
          filters {
            id
            name
          }
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

const copyrightInfoFragment = gql`
  ${contributorInfoFragment}
  fragment CopyrightInfo on Copyright {
    license {
      license
      url
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

export const topicInfoFragment = gql`
  fragment TopicInfo on Topic {
    id
    name
    parent
    filters {
      id
      name
    }
    contentUri
    path
    meta {
      id
      metaDescription
      metaImage {
        url
        alt
      }
    }
  }
`;

export const subjectInfoFragment = gql`
  fragment SubjectInfo on Subject {
    id
    name
    path
  }
`;

export const resourceInfoFragment = gql`
  fragment ResourceInfo on Resource {
    id
    name
    contentUri
    path
    paths
    filters {
      id
      name
      subjectId
      relevanceId
    }
    resourceTypes {
      id
      name
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

export const articleInfoFragment = gql`
  ${copyrightInfoFragment}
  fragment ArticleInfo on Article {
    id
    title
    introduction
    content
    metaDescription
    metaImage {
      url
      alt
    }
    supportedLanguages
    tags
    created
    updated
    published
    oldNdlaUrl
    grepCodes
    requiredLibraries {
      name
      url
      mediaType
    }
    metaData {
      footnotes {
        ref
        title
        year
        authors
        edition
        publisher
        url
      }
      images {
        title
        altText
        src
        copyright {
          ...CopyrightInfo
        }
      }
      h5ps {
        title
        src
        copyright {
          ...CopyrightInfo
        }
      }
      audios {
        title
        src
        copyright {
          ...CopyrightInfo
        }
      }
      brightcoves {
        title
        description
        cover
        src
        download
        iframe {
          height
          src
          width
        }
        copyright {
          ...CopyrightInfo
        }
        uploadDate
      }
      concepts {
        title
        src
        copyright {
          ...CopyrightInfo
        }
      }
    }
    competenceGoals {
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
    coreElements {
      id
      title
      description
      curriculum {
        id
        title
      }
    }
    copyright {
      ...CopyrightInfo
    }
  }
`;

export const taxonomyEntityInfo = gql`
  ${metaInfoFragment}
  fragment TaxonomyEntityInfo on TaxonomyEntity {
    id
    name
    contentUri
    path
    meta {
      ...MetaInfo
    }
    ... on Resource {
      resourceTypes {
        id
        name
      }
    }
  }
`;

export const subjectpageInfo = gql`
  fragment SubjectPageInfo on SubjectPage {
    id
    topical(subjectId: $subjectId) {
      ...TaxonomyEntityInfo
    }
    banner {
      desktopUrl
    }
    about {
      title
      description
      visualElement {
        type
        url
        alt
      }
    }
    metaDescription
    editorsChoices(subjectId: $subjectId) {
      ...TaxonomyEntityInfo
    }
  }
`;

export const subjectTopicsQuery = gql`
  query subjectTopicsQuery($subjectId: String!, $filterIds: String) {
    subject(id: $subjectId) {
      id
      name
      path
      topics(all: true, filterIds: $filterIds) {
        id
        name
        parent
        path
        meta {
          id
          metaDescription
        }
      }
      filters {
        id
        name
      }
    }
  }
`;

export const topicsQueryWithBreadcrumbs = gql`
  query topicQuery($contentUri: String) {
    topics(contentUri: $contentUri) {
      ...TopicInfo
      breadcrumbs
    }
  }
  ${topicInfoFragment}
`;

export const subjectPageQueryWithTopics = gql`
  query subjectPageQuery(
    $subjectId: String!
    $filterIds: String
    $topicId: String!
  ) {
    subject(id: $subjectId) {
      id
      name
      path
      topics(filterIds: $filterIds) {
        ...TopicInfo
      }
      allTopics: topics(all: true, filterIds: $filterIds) {
        ...TopicInfo
      }
      filters {
        id
        name
        subjectpage {
          ...SubjectPageInfo
        }
      }
      subjectpage {
        ...SubjectPageInfo
      }
    }
    topic(id: $topicId) {
      id
      name
      path
      contentUri
    }
  }
  ${topicInfoFragment}
  ${subjectpageInfo}
  ${taxonomyEntityInfo}
`;

export const subjectPageQuery = gql`
  query subjectPageQuery($subjectId: String!, $filterIds: String) {
    subject(id: $subjectId) {
      id
      name
      path
      topics(filterIds: $filterIds) {
        ...TopicInfo
      }
      allTopics: topics(all: true, filterIds: $filterIds) {
        ...TopicInfo
      }
      filters {
        id
        name
        subjectpage {
          ...SubjectPageInfo
        }
      }
      subjectpage {
        ...SubjectPageInfo
      }
    }
  }
  ${topicInfoFragment}
  ${subjectpageInfo}
  ${taxonomyEntityInfo}
`;

export const subjectsQuery = gql`
  query subjectsQuery {
    subjects {
      ...SubjectInfo
    }
  }
  ${subjectInfoFragment}
`;

export const searchPageQuery = gql`
  query searchPageQuery {
    subjects {
      ...SubjectInfo
      filters {
        id
        name
      }
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

export const resourceTypesQuery = gql`
  query resourceTypesQuery {
    resourceTypes {
      id
      name
    }
  }
`;

export const topicResourcesQuery = gql`
  query topicResourcesQuery(
    $topicId: String!
    $filterIds: String
    $subjectId: String
  ) {
    topic(id: $topicId, subjectId: $subjectId) {
      id
      coreResources(filterIds: $filterIds, subjectId: $subjectId) {
        ...ResourceInfo
      }
      supplementaryResources(filterIds: $filterIds, subjectId: $subjectId) {
        ...ResourceInfo
      }
    }
  }
  ${resourceInfoFragment}
`;

const learningpathInfoFragment = gql`
  fragment LearningpathInfo on Learningpath {
    id
    title
    description
    duration
    lastUpdated
    supportedLanguages
    tags
    copyright {
      license {
        license
        url
        description
      }
      contributors {
        ...ContributorInfo
      }
    }
    coverphoto {
      url
      metaUrl
    }
    learningsteps {
      id
      title
      description
      seqNo
      oembed {
        type
        version
        height
        html
        width
      }
      embedUrl {
        url
        embedType
      }
      resource {
        ...ResourceInfo
        article(removeRelatedContent: "true") {
          ...ArticleInfo
          oembed
        }
      }
      license {
        license
        url
        description
      }
      type
      showTitle
    }
  }
  ${resourceInfoFragment}
  ${contributorInfoFragment}
  ${articleInfoFragment}
`;

export const resourceQuery = gql`
  query resourceQuery(
    $resourceId: String!
    $filterIds: String
    $subjectId: String
  ) {
    resource(id: $resourceId, subjectId: $subjectId) {
      ...ResourceInfo
      article(filterIds: $filterIds, subjectId: $subjectId) {
        ...ArticleInfo
      }
      learningpath {
        ...LearningpathInfo
      }
    }
  }
  ${learningpathInfoFragment}
  ${resourceInfoFragment}
  ${articleInfoFragment}
`;

export const movedResourceQuery = gql`
  query resourceQuery($resourceId: String!) {
    resource(id: $resourceId) {
      breadcrumbs
    }
  }
`;

export const plainArticleQuery = gql`
  query plainArticleQuery($articleId: String!, $removeRelatedContent: String) {
    article(id: $articleId, removeRelatedContent: $removeRelatedContent) {
      ...ArticleInfo
    }
  }
  ${articleInfoFragment}
`;

export const topicQueryWithPathTopics = gql`
  query topicQuery($topicId: String!, $filterIds: String, $subjectId: String!) {
    subject(id: $subjectId) {
      id
      name
      path
      topics(filterIds: $filterIds) {
        ...TopicInfo
      }
      allTopics: topics(all: true, filterIds: $filterIds) {
        ...TopicInfo
      }
    }
    topic(id: $topicId, subjectId: $subjectId) {
      id
      name
      path
      pathTopics {
        id
        name
        path
      }
      filters {
        id
        name
      }
      meta {
        id
        metaDescription
        metaImage {
          url
          alt
        }
      }
      subtopics(filterIds: $filterIds) {
        id
        name
      }
      article {
        ...ArticleInfo
        crossSubjectTopics(subjectId: $subjectId, filterIds: $filterIds) {
          code
          title
          path
        }
      }
      coreResources(filterIds: $filterIds, subjectId: $subjectId) {
        ...ResourceInfo
      }
      supplementaryResources(filterIds: $filterIds, subjectId: $subjectId) {
        ...ResourceInfo
      }
    }
    resourceTypes {
      id
      name
    }
  }
  ${topicInfoFragment}
  ${articleInfoFragment}
  ${resourceInfoFragment}
`;

export const topicQuery = gql`
  query topicQuery($topicId: String!, $filterIds: String, $subjectId: String) {
    topic(id: $topicId, subjectId: $subjectId) {
      id
      name
      path
      filters {
        id
        name
      }
      meta {
        id
        metaDescription
        metaImage {
          url
          alt
        }
      }
      subtopics(filterIds: $filterIds) {
        id
        name
      }
      article {
        ...ArticleInfo
      }
      coreResources(filterIds: $filterIds, subjectId: $subjectId) {
        ...ResourceInfo
      }
      supplementaryResources(filterIds: $filterIds, subjectId: $subjectId) {
        ...ResourceInfo
      }
    }
    resourceTypes {
      id
      name
    }
  }
  ${articleInfoFragment}
  ${resourceInfoFragment}
`;

export const learningPathStepQuery = gql`
  query learningPathStepQuery($pathId: String!) {
    learningpath(pathId: $pathId) {
      ...LearningpathInfo
    }
  }
  ${learningpathInfoFragment}
`;

export const competenceGoalsQuery = gql`
  query competenceGoalsQuery(
    $codes: [String]
    $nodeId: String
    $language: String
  ) {
    competenceGoals(codes: $codes, nodeId: $nodeId, language: $language) {
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

export const filmFrontPageQuery = gql`
  query filmFrontPageQuery {
    filmfrontpage {
      name
      about {
        title
        description
        language
        visualElement {
          type
          alt
          url
        }
      }
      movieThemes {
        name {
          name
          language
        }
        movies {
          ...MovieInfo
        }
      }
      slideShow {
        ...MovieInfo
      }
    }
  }
  ${movieFragment}
`;

export const mastHeadQuery = gql`
  query mastHeadQuery(
    $subjectId: String!
    $filterIds: String
    $topicId: String!
    $resourceId: String!
    $skipTopic: Boolean!
    $skipResource: Boolean!
  ) {
    subject(id: $subjectId) {
      id
      name
      path
      topics(all: true, filterIds: $filterIds) {
        id
        name
        parent
        path
        meta {
          id
          metaDescription
        }
      }
      filters {
        id
        name
      }
    }
    resourceTypes {
      id
      name
    }
    topic(id: $topicId, subjectId: $subjectId) @skip(if: $skipTopic) {
      id
      coreResources(filterIds: $filterIds, subjectId: $subjectId) {
        ...ResourceInfo
      }
      supplementaryResources(filterIds: $filterIds, subjectId: $subjectId) {
        ...ResourceInfo
      }
    }
    resource(id: $resourceId, subjectId: $subjectId) @skip(if: $skipResource) {
      ...ResourceInfo
      article(filterIds: $filterIds, subjectId: $subjectId) {
        ...ArticleInfo
      }
      learningpath {
        ...LearningpathInfo
      }
    }
  }
  ${learningpathInfoFragment}
  ${articleInfoFragment}
  ${resourceInfoFragment}
`;

export const topicPageQuery = gql`
  query topicPageQuery(
    $topicId: String!
    $filterIds: String!
    $subjectId: String!
  ) {
    topic(id: $topicId, subjectId: $subjectId) {
      id
      name
      path
      meta {
        id
        metaDescription
        metaImage {
          url
          alt
        }
      }
      article {
        ...ArticleInfo
      }
      coreResources(filterIds: $filterIds, subjectId: $subjectId) {
        ...ResourceInfo
      }
      supplementaryResources(filterIds: $filterIds, subjectId: $subjectId) {
        ...ResourceInfo
      }
    }
    subject(id: $subjectId) {
      id
      name
      path
      topics(all: true, filterIds: $filterIds) {
        id
        name
        parent
        path
        meta {
          id
          metaDescription
        }
      }
      filters {
        id
        name
      }
    }
    resourceTypes {
      id
      name
    }
  }
  ${articleInfoFragment}
  ${resourceInfoFragment}
`;

export const resourcePageQuery = gql`
  query resourcePageQuery(
    $topicId: String!
    $filterIds: String!
    $subjectId: String!
    $resourceId: String!
  ) {
    subject(id: $subjectId) {
      id
      name
      path
      topics(all: true, filterIds: $filterIds) {
        id
        name
        parent
        path
        meta {
          id
          metaDescription
        }
      }
      filters {
        id
        name
      }
    }
    resourceTypes {
      id
      name
      subtypes {
        id
        name
      }
    }
    topic(id: $topicId, subjectId: $subjectId) {
      id
      name
      path
      filters {
        id
        name
      }
      coreResources(filterIds: $filterIds, subjectId: $subjectId) {
        ...ResourceInfo
      }
      supplementaryResources(filterIds: $filterIds, subjectId: $subjectId) {
        ...ResourceInfo
      }
    }
    resource(id: $resourceId, subjectId: $subjectId) {
      ...ResourceInfo
      article(filterIds: $filterIds, subjectId: $subjectId) {
        ...ArticleInfo
      }
      learningpath {
        ...LearningpathInfo
      }
    }
  }
  ${learningpathInfoFragment}
  ${resourceInfoFragment}
  ${articleInfoFragment}
  ${resourceInfoFragment}
`;
