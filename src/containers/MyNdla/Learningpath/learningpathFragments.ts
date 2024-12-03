/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";

export const learningpathFragment = gql`
  fragment Learningpath on MyNdlaLearningpath {
    id
    title
    description
    created
    status
    madeAvailable
    coverphoto {
      url
    }
  }
`;
