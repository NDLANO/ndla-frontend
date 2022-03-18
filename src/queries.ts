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

export const conceptSearchInfoFragment = gql`
  fragment ConceptSearchConcept on Concept {
    id
    title
    text: content
    image: metaImage {
      url
      alt
    }
  }
`;

export const conceptSearchQuery = gql`
  query ConceptSearch(
    $query: String
    $subjects: String
    $exactMatch: Boolean
    $language: String
    $fallback: Boolean
  ) {
    conceptSearch(
      query: $query
      subjects: $subjects
      exactMatch: $exactMatch
      language: $language
      fallback: $fallback
    ) {
      concepts {
        ...ConceptSearchConcept
      }
    }
  }
  ${conceptSearchInfoFragment}
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

const conceptCopyrightInfoFragment = gql`
  ${contributorInfoFragment}
  fragment ConceptCopyrightInfo on ConceptCopyright {
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

export const copyrightInfoFragment = gql`
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

export const articleInfoFragment = gql`
  ${copyrightInfoFragment}
  ${conceptCopyrightInfoFragment}
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
      }
      concepts {
        title
        src
        copyright {
          ...ConceptCopyrightInfo
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
        ...ConceptCopyrightInfo
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

export const withArticleInfo = gql`
  fragment WithArticleInfo on WithArticle {
    meta {
      ...MetaInfo
    }
  }
  ${metaInfoFragment}
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
  ${taxonomyEntityInfo}
`;

export const subjectPageQueryWithTopics = gql`
  query subjectPageWithTopics(
    $subjectId: String!
    $topicId: String!
    $includeTopic: Boolean!
    $metadataFilterKey: String
    $metadataFilterValue: String
  ) {
    subject(id: $subjectId) {
      ...SubjectInfo
      topics {
        supportedLanguages
        availability
        ...TopicInfo
      }
      allTopics: topics(all: true) {
        ...TopicInfo
      }
      grepCodes
      subjectpage {
        ...SubjectPageInfo
      }
    }
    topic(id: $topicId) @include(if: $includeTopic) {
      ...TopicInfo
      alternateTopics {
        id
        name
        path
        supportedLanguages
        breadcrumbs
        meta {
          ...MetaInfo
        }
      }
    }
    subjects(
      metadataFilterKey: $metadataFilterKey
      metadataFilterValue: $metadataFilterValue
    ) {
      ...SubjectInfo
      metadata {
        customFields
      }
    }
  }
  ${metaInfoFragment}
  ${topicInfoFragment}
  ${taxonomyEntityInfo}
  ${subjectpageInfo}
  ${subjectInfoFragment}
`;

export const subjectPageQueryInfoFragment = gql`
  fragment SubjectPageQueryInfo on Subject {
    id
    name
    path
    topics {
      ...TopicInfo
    }
  }
  ${topicInfoFragment}
`;

export const subjectPageQuery = gql`
  query subjectPage($subjectId: String!) {
    subject(id: $subjectId) {
      ...SubjectPageQueryInfo
      allTopics: topics(all: true) {
        ...TopicInfo
      }
      subjectpage {
        ...SubjectPageInfo
      }
    }
  }
  ${subjectPageQueryInfoFragment}
  ${topicInfoFragment}
  ${subjectpageInfo}
`;

export const multiDisciplinarySubjectPageQuery = gql`
  query multiDisciplinarySubjectPage($subjectId: String!) {
    subject(id: $subjectId) {
      ...SubjectPageQueryInfo
      allTopics: topics(all: true) {
        ...TopicInfo
      }
    }
  }
  ${subjectPageQueryInfoFragment}
  ${topicInfoFragment}
`;

export const filmSubjectPageQuery = gql`
  query filmSubjectPage($subjectId: String!) {
    subject(id: $subjectId) {
      ...SubjectPageQueryInfo
    }
  }
  ${subjectPageQueryInfoFragment}
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

export const iframeResourceFragment = gql`
  fragment IframeResource on Resource {
    id
    name
    path
    resourceTypes {
      id
      name
    }
  }
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
      ...IframeResource
    }
    topic(id: $taxonomyId) @include(if: $includeTopic) {
      id
      name
      path
    }
  }
  ${iframeResourceFragment}
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
      relevanceId
      meta {
        ...MetaInfo
      }
      metadata {
        customFields
      }
      subtopics {
        id
        name
        relevanceId
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

export const topicQueryTopicFragment = gql`
  fragment TopicQueryTopic on Topic {
    id
    name
    path
    parent
    relevanceId
    meta {
      ...MetaInfo
    }
    subtopics {
      id
      name
      relevanceId
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
  ${resourceInfoFragment}
  ${articleInfoFragment}
  ${metaInfoFragment}
`;

export const topicQuery = gql`
  query topic($topicId: String!, $subjectId: String) {
    topic(id: $topicId, subjectId: $subjectId) {
      ...TopicQueryTopic
    }
    resourceTypes {
      id
      name
    }
  }
  ${topicQueryTopicFragment}
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

export const alertsQuery = gql`
  query alerts {
    alerts {
      title
      body
    }
  }
`;
