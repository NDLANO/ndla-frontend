/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GQLLearningpath_LearningpathStepFragment } from "../../graphqlTypes";

export interface BaseStepProps {
  learningpathStep: GQLLearningpath_LearningpathStepFragment;
  skipToContentId?: string;
}
