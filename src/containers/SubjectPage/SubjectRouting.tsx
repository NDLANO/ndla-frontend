/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Navigate } from "react-router-dom";
import SubjectPage from "./SubjectPage";
import { GQLContextQuery, GQLContextQueryVariables } from "../../graphqlTypes";
import { contextQuery } from "../../queries";
import { getSubjectType, useUrnIds } from "../../routeHelpers";
import { useGraphQuery } from "../../util/runQueries";
import FilmFrontpage from "../FilmFrontpage/FilmFrontpage";
import MultidisciplinarySubjectArticlePage from "../MultidisciplinarySubject/MultidisciplinarySubjectArticlePage";

const SubjectRouting = () => {
  const { contextId, subjectId: subId, topicId: tId, topicList: tList } = useUrnIds();
  const { data: newData, previousData } = useGraphQuery<GQLContextQuery, GQLContextQueryVariables>(contextQuery, {
    variables: {
      contextId: contextId ?? "",
    },
    skip: contextId === undefined,
  });

  const data = newData ?? previousData;

  const node = data?.node;
  const subjectId = node?.context?.rootId ?? subId ?? "";
  if (!subjectId) {
    return <Navigate to="/404" replace />;
  }

  const topicId = node?.nodeType === "TOPIC" ? node?.id : tId;
  const topicList = node?.context?.parentIds ?? tList;
  const subjectType = getSubjectType(subjectId);

  if (subjectType === "film" && topicList.length === 0) {
    return <FilmFrontpage />;
  } else if (subjectType === "multiDisciplinary" && topicList.length === 3) {
    return <MultidisciplinarySubjectArticlePage subjectId={subjectId} topicId={topicId} />;
  }
  return (
    <SubjectPage
      key={subjectId}
      subjectType={subjectType}
      subjectId={subjectId}
      topicId={topicId}
      topicList={topicList}
    />
  );
};

export default SubjectRouting;
