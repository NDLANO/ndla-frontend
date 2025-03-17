/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GQLSubjectMenu_RootFragment } from "../../../graphqlTypes";

export type MenuType = "programme" | "om" | "subject";

export type AllTopicsType = NonNullable<GQLSubjectMenu_RootFragment["allTopics"]>[0];

export type TopicWithSubTopics = AllTopicsType & {
  subtopics: TopicWithSubTopics[];
};
