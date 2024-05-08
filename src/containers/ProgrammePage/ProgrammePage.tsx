/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { Spinner } from "@ndla/icons";
import ProgrammeContainer from "./ProgrammeContainer";
import { RedirectExternal, Status } from "../../components";
import DefaultErrorMessage from "../../components/DefaultErrorMessage";
import { programmeRedirects } from "../../constants";
import { GQLProgrammePageQuery } from "../../graphqlTypes";
import { toProgramme, TypedParams, useTypedParams } from "../../routeHelpers";
import { useGraphQuery } from "../../util/runQueries";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

interface MatchParams extends TypedParams {
  programme: string;
  grade?: string;
}

const programmePageQuery = gql`
  query programmePage($path: String!) {
    programme(path: $path) {
      grades {
        title {
          title
        }
      }
      ...ProgrammeContainer_Programme
    }
  }
  ${ProgrammeContainer.fragments.programme}
`;

const ProgrammePage = () => {
  const { i18n } = useTranslation();
  const { programme: path, grade: gradeParam } = useTypedParams<MatchParams>();
  const oldProgramme = programmeRedirects[path] !== undefined;
  const { loading, data } = useGraphQuery<GQLProgrammePageQuery>(programmePageQuery, {
    variables: { path: path },
    skip: oldProgramme,
  });

  if (oldProgramme) {
    return (
      <Status code={301}>
        <RedirectExternal to={toProgramme(encodeURIComponent(programmeRedirects[path] || ""), gradeParam)} />
      </Status>
    );
  }

  if (loading) {
    return <Spinner />;
  }

  if (!data) {
    return <DefaultErrorMessage />;
  }

  if (!data.programme) {
    return <NotFoundPage />;
  }

  const selectedGrade =
    data.programme.grades?.find((grade) => grade.title.title.toLowerCase() === gradeParam) ??
    data.programme.grades?.[0];

  return (
    <ProgrammeContainer programme={data.programme} grade={selectedGrade?.title.title || ""} locale={i18n.language} />
  );
};

export default ProgrammePage;
