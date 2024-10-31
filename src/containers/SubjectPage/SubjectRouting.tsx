/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Navigate } from "react-router-dom";
import SubjectPage from "./SubjectPage";
import { useUrnIds } from "../../routeHelpers";
import FilmFrontpage from "../FilmFrontpage/FilmFrontpage";
import MultidisciplinarySubjectArticlePage from "../MultidisciplinarySubject/MultidisciplinarySubjectArticlePage";

const SubjectRouting = () => {
  const { topicList, subjectId, subjectType } = useUrnIds();

  if (subjectType === "standard") {
    return <SubjectPage key={subjectId} />;
  } else if (subjectType === "multiDisciplinary") {
    if (topicList.length === 3) {
      return <MultidisciplinarySubjectArticlePage />;
    }
    return <SubjectPage key={subjectId} />;
  } else if (subjectType === "toolbox") {
    return <SubjectPage key={subjectId} />;
  } else if (subjectType === "film" && topicList.length === 0) {
    return <FilmFrontpage />;
  } else if (subjectType === "film") {
    return <SubjectPage key={subjectId} />;
  }

  return <Navigate to="/404" replace />;
};

export default SubjectRouting;
