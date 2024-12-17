/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";

export const learningpathStepEmbedUrl = gql`
  fragment LearningpathStepEmbedUrl on LearningpathStepEmbedUrl {
    url
    embedType
  }
`;

export const learningpathStepOembed = gql`
  fragment LearningpathStepOembed on LearningpathStepOembed {
    type
    version
    height
    html
    width
  }
`;

export const articleFragment = gql`
  fragment Resource_Article on Article {
    id
    metaDescription
    created
    updated
    articleType
    title
  }
`;

export const learningpathStepFragment = gql`
  fragment MyNdlaLearningpathStep on MyNdlaLearningpathStep {
    id
    title
    seqNo
    description
    introduction
    type
    supportedLanguages
    showTitle
    revision
    embedUrl {
      ...LearningpathStepEmbedUrl
    }
    oembed {
      ...LearningpathStepOembed
    }
    resource {
      id
      path
      breadcrumbs
      resourceTypes {
        id
        name
      }
      article {
        ...Resource_Article
      }
    }
  }
  ${learningpathStepOembed}
  ${learningpathStepEmbedUrl}
  ${articleFragment}
`;

export const learningpathFragment = gql`
  fragment MyNdlaLearningpath on MyNdlaLearningpath {
    id
    title
    description
    created
    status
    madeAvailable
    revision
    coverphoto {
      url
    }
    learningsteps {
      ...MyNdlaLearningpathStep
    }
  }
  ${learningpathStepFragment}
`;
