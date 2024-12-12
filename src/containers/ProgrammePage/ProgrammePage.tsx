/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { gql } from "@apollo/client";
import ProgrammeContainer from "./ProgrammeContainer";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { GQLProgrammePageQuery } from "../../graphqlTypes";
import { TypedParams, useTypedParams } from "../../routeHelpers";
import { useGraphQuery } from "../../util/runQueries";
import { isValidContextId } from "../../util/urlHelper";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";

interface MatchParams extends TypedParams {
  programme?: string;
  contextId?: string;
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
  const { programme, contextId, grade } = useTypedParams<MatchParams>();

  const { loading, data } = useGraphQuery<GQLProgrammePageQuery>(programmePageQuery, {
    variables: { contextId: contextId },
    skip: programme?.includes("__") || !isValidContextId(contextId),
  });

  if (programme?.includes("__")) {
    const [name = "", programmeId] = programme.split("__");
    let to = `/utdanning/${name}/${programmeId}`;
    if (contextId) {
      to += `/${contextId}`;
    }
    return <Navigate to={to} replace />;
  }

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
    data.programme.grades?.find((g) => g.title.title.toLowerCase() === grade) ?? data.programme.grades?.[0];

  return (
    <ProgrammeContainer programme={data.programme} grade={selectedGrade?.title.title || ""} locale={i18n.language} />
  );
};

export default ProgrammePage;
