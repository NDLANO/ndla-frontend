/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, QueryHookOptions } from "@apollo/client";
import { GQLMyLearningpathsQuery } from "../../graphqlTypes";
import { useGraphQuery } from "../../util/runQueries";

const learningstep = gql`
  fragment LearningpathStepFragment on LearningpathStep {
    id
    title
    seqNo
    description
    embedUrl {
      url
      embedType
    }
    license {
      license
      url
      description
    }
    metaUrl
    revision
    status
    supportedLanguages
    type
    showTitle
  }
`;

const learningpath = gql`
  fragment LearningpathFragment on Learningpath {
    id
    title
    description
    duration
    copyright {
      license {
        license
        url
        description
      }
      contributors {
        type
        name
      }
    }
    canEdit
    verificationStatus
    tags
    isBasedOn
    learningsteps {
      ...LearningpathStepFragment
    }
    metaUrl
    revision

    learningstepUrl
    status
    coverphoto {
      metaUrl
      url
    }
  }
  ${learningstep}
`;

const myLearningpathsQuery = gql`
  query myLearningpaths {
    myLearningpaths {
      ...LearningpathFragment
    }
  }
  ${learningpath}
`;

export const useMyLearningpaths = (options?: QueryHookOptions<GQLMyLearningpathsQuery>) => {
  const { data, loading, error } = useGraphQuery(myLearningpathsQuery, { ...options });
  return { learningpaths: data?.myLearningpaths, loading, error };
};
