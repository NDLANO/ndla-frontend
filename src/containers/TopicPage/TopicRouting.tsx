/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TopicPage } from "./TopicPage";
import { useUrnIds } from "../../routeHelpers";
import MultidisciplinarySubjectArticlePage from "../MultidisciplinarySubject/MultidisciplinarySubjectArticlePage";

export const TopicRouting = () => {
  const { topicList, subjectType } = useUrnIds();

  if (subjectType === "multiDisciplinary" && topicList.length === 3) {
    return <MultidisciplinarySubjectArticlePage />;
  }

  return <TopicPage />;
};
