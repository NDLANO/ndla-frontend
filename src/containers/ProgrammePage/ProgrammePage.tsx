/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import ProgrammeContainer from "./ProgrammeContainer";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { GQLProgrammePageQuery } from "../../graphqlTypes";
import { TypedParams, useTypedParams } from "../../routeHelpers";
import { useGraphQuery } from "../../util/runQueries";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";

interface MatchParams extends TypedParams {
  programme: string;
  contextId: string;
  grade?: string;
}

const programmePageQuery = gql`
  query programmePage($contextId: String) {
    programme(contextId: $contextId) {
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
  const { contextId, grade: gradeParam } = useTypedParams<MatchParams>();

  const { loading, data } = useGraphQuery<GQLProgrammePageQuery>(programmePageQuery, {
    variables: { contextId: contextId },
  });

  if (loading) {
    return <ContentPlaceholder padding="large" />;
  }

  if (!data) {
    return <DefaultErrorMessagePage />;
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
