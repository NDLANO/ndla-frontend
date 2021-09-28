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
    $aggregatePaths: [String!]
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
  query ConceptSearch(
    $query: String
    $subjects: String
    $exactMatch: Boolean
    $language: String
  ) {
    conceptSearch(
      query: $query
      subjects: $subjects
      exactMatch: $exactMatch
      language: $language
    ) {
      concepts {
        id
        title
        text: content
        image: metaImage {
          url
          alt
        }
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
    article {
      supportedLanguages
    }
    name
    parent
    contentUri
    path
    meta {
      ...MetaInfo
    }
  }
  ${metaInfoFragment}
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
    relevanceId
    rank
    resourceTypes {
      id
      name
    }
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
      copyText
    }
    h5p {
      src
      thumbnail
      copyText
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

export const articleInfoFragment = gql`
  ${copyrightInfoFragment}
  ${visualElementFragment}
  fragment ArticleInfo on Article {
    id
    title
    introduction
    content
    articleType
    revision
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
      copyText
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
        copyText
      }
      h5ps {
        title
        src
        copyright {
          ...CopyrightInfo
        }
        copyText
      }
      audios {
        title
        src
        copyright {
          ...CopyrightInfo
        }
        copyText
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
        copyText
      }
      concepts {
        title
        src
        copyright {
          ...CopyrightInfo
        }
        copyText
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
    oembed
    copyright {
      ...CopyrightInfo
    }
    visualElement {
      ...VisualElementInfo
    }
    conceptIds
    concepts {
      id
      title
      content
      subjectNames
      copyright {
        ...CopyrightInfo
      }
      visualElement {
        ...VisualElementInfo
      }
    }
    relatedContent {
      title
      url
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
  query subjectTopics($subjectId: String!) {
    subject(id: $subjectId) {
      id
      name
      path
      topics(all: true) {
        id
        name
        parent
        path
        meta {
          ...MetaInfo
        }
      }
    }
  }
  ${metaInfoFragment}
`;

export const topicsQueryWithBreadcrumbs = gql`
  query topicsWithBreadcrumbs($contentUri: String, $filterVisible: Boolean) {
    topics(contentUri: $contentUri, filterVisible: $filterVisible) {
      ...TopicInfo
      breadcrumbs
    }
  }
  ${topicInfoFragment}
`;

export const subjectPageQueryWithTopics = gql`
  query subjectPageWithTopics(
    $subjectId: String!
    $filterIds: String
    $topicId: String!
    $includeTopic: Boolean!
  ) {
    subject(id: $subjectId) {
      ...SubjectInfo
      topics(filterIds: $filterIds) {
        ...TopicInfo
      }
      allTopics: topics(all: true, filterIds: $filterIds) {
        ...TopicInfo
      }
      subjectpage {
        ...SubjectPageInfo
      }
    }
    topic(id: $topicId) @include(if: $includeTopic) {
      id
      name
      path
      contentUri
      alternateTopics {
        id
        name
        path
        breadcrumbs
        meta {
          ...MetaInfo
        }
      }
    }
    subjects {
      ...SubjectInfo
      metadata {
        customFields
      }
    }
  }
  ${metaInfoFragment}
  ${subjectInfoFragment}
  ${topicInfoFragment}
  ${subjectpageInfo}
  ${taxonomyEntityInfo}
  ${subjectInfoFragment}
`;

export const subjectPageQuery = gql`
  query subjectPage($subjectId: String!) {
    subject(id: $subjectId) {
      id
      name
      path
      topics {
        ...TopicInfo
      }
      allTopics: topics(all: true) {
        ...TopicInfo
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
  query subjects {
    subjects {
      ...SubjectInfo
    }
  }
  ${subjectInfoFragment}
`;

export const searchPageQuery = gql`
  query searchPage {
    subjects {
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

export const resourceTypesQuery = gql`
  query resourceTypes {
    resourceTypes {
      id
      name
    }
  }
`;

export const topicResourcesQuery = gql`
  query topicResources($topicId: String!, $subjectId: String) {
    topic(id: $topicId, subjectId: $subjectId) {
      id
      coreResources(subjectId: $subjectId) {
        ...ResourceInfo
      }
      supplementaryResources(subjectId: $subjectId) {
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
        article(isOembed: "true") {
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
  query resource($resourceId: String!, $subjectId: String) {
    resource(id: $resourceId, subjectId: $subjectId) {
      ...ResourceInfo
      article(subjectId: $subjectId) {
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
  query movedResource($resourceId: String!) {
    resource(id: $resourceId) {
      breadcrumbs
    }
  }
`;

export const plainArticleQuery = gql`
  query plainArticle($articleId: String!, $isOembed: String, $path: String) {
    article(id: $articleId, isOembed: $isOembed, path: $path) {
      ...ArticleInfo
    }
  }
  ${articleInfoFragment}
`;

export const iframeArticleQuery = gql`
  query iframeArticle(
    $articleId: String!
    $isOembed: String
    $path: String
    $taxonomyId: String!
    $includeResource: Boolean!
    $includeTopic: Boolean!
  ) {
    article(id: $articleId, isOembed: $isOembed, path: $path) {
      ...ArticleInfo
    }
    resource(id: $taxonomyId) @include(if: $includeResource) {
      id
      name
      path
      resourceTypes {
        id
        name
      }
    }
    topic(id: $taxonomyId) @include(if: $includeTopic) {
      id
      name
      path
    }
  }
  ${articleInfoFragment}
`;

export const topicQueryWithPathTopics = gql`
  query topicWithPathTopics(
    $topicId: String!
    $subjectId: String!
    $showVisualElement: String
  ) {
    subject(id: $subjectId) {
      id
      name
      path
      topics {
        ...TopicInfo
      }
      allTopics: topics(all: true) {
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
      meta {
        ...MetaInfo
      }
      subtopics {
        id
        name
      }
      article(showVisualElement: $showVisualElement) {
        ...ArticleInfo
        crossSubjectTopics(subjectId: $subjectId) {
          code
          title
          path
        }
      }
      coreResources(subjectId: $subjectId) {
        ...ResourceInfo
      }
      supplementaryResources(subjectId: $subjectId) {
        ...ResourceInfo
      }
    }
    resourceTypes {
      id
      name
    }
  }
  ${metaInfoFragment}
  ${topicInfoFragment}
  ${articleInfoFragment}
  ${resourceInfoFragment}
`;

export const topicQuery = gql`
  query topic($topicId: String!, $subjectId: String) {
    topic(id: $topicId, subjectId: $subjectId) {
      id
      name
      path
      meta {
        ...MetaInfo
      }
      subtopics {
        id
        name
      }
      article {
        ...ArticleInfo
      }
      coreResources(subjectId: $subjectId) {
        ...ResourceInfo
      }
      supplementaryResources(subjectId: $subjectId) {
        ...ResourceInfo
      }
      metadata {
        customFields
      }
    }
    resourceTypes {
      id
      name
    }
  }
  ${metaInfoFragment}
  ${articleInfoFragment}
  ${resourceInfoFragment}
`;

export const learningPathStepQuery = gql`
  query learningPathStep($pathId: String!) {
    learningpath(pathId: $pathId) {
      ...LearningpathInfo
    }
  }
  ${learningpathInfoFragment}
`;

export const competenceGoalsQuery = gql`
  query competenceGoals($codes: [String!], $nodeId: String, $language: String) {
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
  query filmFrontPage {
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
  query mastHead(
    $subjectId: String!
    $topicId: String!
    $resourceId: String!
    $skipTopic: Boolean!
    $skipResource: Boolean!
  ) {
    subject(id: $subjectId) {
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
      article(subjectId: $subjectId) {
        ...ArticleInfo
      }
      learningpath {
        ...LearningpathInfo
      }
    }
  }
  ${topicInfoFragment}
  ${learningpathInfoFragment}
  ${articleInfoFragment}
  ${resourceInfoFragment}
`;

export const topicPageQuery = gql`
  query topicPage($topicId: String!, $subjectId: String!) {
    topic(id: $topicId, subjectId: $subjectId) {
      id
      name
      path
      meta {
        ...MetaInfo
      }
      article {
        ...ArticleInfo
      }
      coreResources(subjectId: $subjectId) {
        ...ResourceInfo
      }
      supplementaryResources(subjectId: $subjectId) {
        ...ResourceInfo
      }
    }
    subject(id: $subjectId) {
      id
      name
      path
      topics(all: true) {
        id
        name
        parent
        path
        meta {
          ...MetaInfo
        }
      }
    }
    resourceTypes {
      id
      name
    }
  }
  ${metaInfoFragment}
  ${articleInfoFragment}
  ${resourceInfoFragment}
`;

export const resourcePageQuery = gql`
  query resourcePage(
    $topicId: String!
    $subjectId: String!
    $resourceId: String!
  ) {
    subject(id: $subjectId) {
      id
      name
      path
      topics(all: true) {
        id
        name
        parent
        path
        meta {
          ...MetaInfo
        }
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
      coreResources(subjectId: $subjectId) {
        ...ResourceInfo
      }
      supplementaryResources(subjectId: $subjectId) {
        ...ResourceInfo
      }
      metadata {
        customFields
      }
    }
    resource(id: $resourceId, subjectId: $subjectId, topicId: $topicId) {
      ...ResourceInfo
      article(subjectId: $subjectId) {
        ...ArticleInfo
      }
      learningpath {
        ...LearningpathInfo
      }
    }
  }
  ${metaInfoFragment}
  ${learningpathInfoFragment}
  ${resourceInfoFragment}
  ${articleInfoFragment}
  ${resourceInfoFragment}
`;
