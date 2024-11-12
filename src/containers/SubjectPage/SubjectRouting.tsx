/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Navigate } from "react-router-dom";
import SubjectPage from "./SubjectPage";
import { SubjectType, useUrnIds } from "../../routeHelpers";
import FilmFrontpage from "../FilmFrontpage/FilmFrontpage";

const VALID_SUBJECT_TYPES: SubjectType[] = ["standard", "multiDisciplinary", "toolbox"];

const SubjectRouting = () => {
  const { subjectId, subjectType } = useUrnIds();

  if (VALID_SUBJECT_TYPES.includes(subjectType)) {
    return <SubjectPage key={subjectId} />;
  } else if (subjectType === "film") {
    return <FilmFrontpage />;
  }

  return <Navigate to="/404" replace />;
};

export default SubjectRouting;
