/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import gql from 'graphql-tag';

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
    $fallback: Boolean
    $subjects: String
    $languageFilter: String
    $relevance: String
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
    $fallback: Boolean
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
      }
      totalCount
    }
  }
`;

export const groupSearchQuery = gql`
  query GroupSearch($resourceTypes: String, $subjects: String, $query: String) {
    groupSearch(
      resourceTypes: $resourceTypes
      subjects: $subjects
      query: $query
    ) {
      resources {
        id
        path
        name
      }
      resourceType
      totalCount
      language
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
        }
        totalCount
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
      name
    }
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
    created
    updated
    published
    oldNdlaUrl
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
        cover
        src
        iframe {
          height
          src
          width
        }
        copyright {
          ...CopyrightInfo
        }
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

export const subjectPageQuery = gql`
  query subjectPageQuery($subjectId: String!, $filterIds: String) {
    subject(id: $subjectId) {
      id
      name
      path
      topics(filterIds: $filterIds) {
        ...TopicInfo
      }
      filters {
        id
        name
      }
      subjectpage {
        id
        topical(subjectId: $subjectId) {
          ...TaxonomyEntityInfo
        }
        banner {
          desktopUrl
          mobileUrl
        }
        facebook
        twitter
        layout
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
        goTo {
          id
          name
        }
        mostRead(subjectId: $subjectId) {
          ...TaxonomyEntityInfo
        }
        latestContent(subjectId: $subjectId) {
          ...TaxonomyEntityInfo
        }
        editorsChoices(subjectId: $subjectId) {
          ...TaxonomyEntityInfo
        }
      }
    }
  }
  ${topicInfoFragment}
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

export const subjectsWithFiltersQuery = gql`
  query subjectsQuery {
    subjects {
      ...SubjectInfo
      filters {
        id
        name
      }
    }
  }
  ${subjectInfoFragment}
`;

export const frontpageQuery = gql`
  query frontpageQuery {
    frontpage {
      topical {
        ...ResourceInfo
      }
      categories {
        name
        subjects {
          ...SubjectInfo
          frontpageFilters {
            id
            name
          }
        }
      }
    }
    subjects {
      ...SubjectInfo
      filters {
        id
        name
      }
    }
  }
  ${resourceInfoFragment}
  ${subjectInfoFragment}
`;

export const resourceTypesWithSubTypesQuery = gql`
  query resourceTypesQuery {
    resourceTypes {
      id
      name
      subtypes {
        id
        name
      }
    }
  }
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
        article {
          ...ArticleInfo
        }
      }
      license {
        license
        url
        description
      }
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

export const topicQuery = gql`
  query topicQuery($topicId: String!, $filterIds: String, $subjectId: String) {
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
  query competenceGoalsQuery($nodeId: String!) {
    competenceGoals(nodeId: $nodeId) {
      id
      name
      curriculum {
        id
        name
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
