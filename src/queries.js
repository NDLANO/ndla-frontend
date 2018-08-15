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
  }
`;

export const topicInfoFragment = gql`
  fragment TopicInfo on Topic {
    id
    name
    parent
    path
    meta {
      metaDescription
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
    created
    updated
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

export const subjectPageArticlesInfo = gql`
  ${resourceInfoFragment}
  ${metaInfoFragment}
  fragment SubjectPageArticlesInfo on SubjectPageArticles {
    resources {
      ...ResourceInfo
      meta {
        ...MetaInfo
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
        ...TopicInfo
      }
      filters {
        id
        name
      }
    }
  }
  ${topicInfoFragment}
`;

export const subjectPageQuery = gql`
  query subjectPageQuery($subjectId: String!, $filterIds: String) {
    subject(id: $subjectId) {
      id
      name
      path
      topics(all: true, filterIds: $filterIds) {
        ...TopicInfo
      }
      filters {
        id
        name
      }
      subjectpage {
        id
        topical {
          resource {
            ...ResourceInfo
            meta {
              ...MetaInfo
            }
          }
        }
        banner {
          desktopUrl
          mobileUrl
        }
        facebook
        twitter
        displayInTwoColumns
        about {
          title
          description
          visualElement {
            type
            url
            alt
          }
        }
        goTo {
          resourceTypes {
            id
            name
          }
        }
        mostRead {
          ...SubjectPageArticlesInfo
        }
        latestContent {
          ...SubjectPageArticlesInfo
        }
        editorsChoices {
          ...SubjectPageArticlesInfo
        }
      }
    }
  }
  ${topicInfoFragment}
  ${subjectPageArticlesInfo}
  ${resourceInfoFragment}
  ${metaInfoFragment}
`;

export const subjectsQuery = gql`
  query subjectsQuery {
    subjects {
      ...SubjectInfo
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
        }
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
  query topicResourcesQuery($topicId: String!, $filterIds: String) {
    topic(id: $topicId) {
      id
      coreResources(filterIds: $filterIds) {
        ...ResourceInfo
      }
      supplementaryResources(filterIds: $filterIds) {
        ...ResourceInfo
      }
    }
  }
  ${resourceInfoFragment}
`;

export const resourceQuery = gql`
  query resourceQuery($resourceId: String!) {
    resource(id: $resourceId) {
      id
      name
      path
      contentUri
      article {
        ...ArticleInfo
      }
      resourceTypes {
        id
        name
      }
    }
  }
  ${articleInfoFragment}
`;

export const topicQuery = gql`
  query topicQuery($topicId: String!, $filterIds: String) {
    topic(id: $topicId) {
      ...TopicInfo
      article {
        ...ArticleInfo
      }
      subtopics(filterIds: $filterIds) {
        ...TopicInfo
      }
      coreResources(filterIds: $filterIds) {
        ...ResourceInfo
      }
      supplementaryResources(filterIds: $filterIds) {
        ...ResourceInfo
      }
    }
  }
  ${topicInfoFragment}
  ${articleInfoFragment}
  ${resourceInfoFragment}
`;
