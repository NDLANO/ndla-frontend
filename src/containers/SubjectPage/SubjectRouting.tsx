/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Navigate } from "react-router-dom";
import SubjectPage from "./SubjectPage";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { GQLContextQuery, GQLContextQueryVariables } from "../../graphqlTypes";
import { contextQuery } from "../../queries";
import { getSubjectType, useUrnIds } from "../../routeHelpers";
import { useGraphQuery } from "../../util/runQueries";
import FilmFrontpage from "../FilmFrontpage/FilmFrontpage";

const SubjectRouting = () => {
  const { contextId, subjectId: subId } = useUrnIds();
  const {
    loading,
    data: newData,
    previousData,
  } = useGraphQuery<GQLContextQuery, GQLContextQueryVariables>(contextQuery, {
    variables: {
      contextId: contextId ?? "",
    },
    skip: contextId === undefined,
  });

  const data = newData ?? previousData;

  if (loading && !data) {
    return <ContentPlaceholder />;
  }

  const node = data?.node;
  const subjectId = node?.context?.rootId ?? subId ?? "";
  if (!subjectId) {
    return <Navigate to="/404" replace />;
  }

  const subjectType = getSubjectType(subjectId);

  if (subjectType === "film") {
    return <FilmFrontpage />;
  }
  return <SubjectPage key={subjectId} subjectType={subjectType} subjectId={subjectId} />;
};

export default SubjectRouting;
