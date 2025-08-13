/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Navigate, useLocation } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import ProgrammeContainer from "./ProgrammeContainer";
import { RedirectExternal } from "../../components/";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { GQLProgrammePageQuery } from "../../graphqlTypes";
import { TypedParams, useTypedParams } from "../../routeHelpers";
import { constructNewPath, isValidContextId } from "../../util/urlHelper";
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
      supportedLanguages
      ...ProgrammeContainer_Programme
    }
  }
  ${ProgrammeContainer.fragments.programme}
`;

export const ProgrammePage = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const { programme, contextId, grade } = useTypedParams<MatchParams>();

  const { loading, data, error } = useQuery<GQLProgrammePageQuery>(programmePageQuery, {
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

  if (error?.graphQLErrors) {
    if (error?.graphQLErrors.some((err) => err.extensions?.status === 404)) {
      return <NotFoundPage />;
    } else {
      return <DefaultErrorMessagePage />;
    }
  }

  if (!data || !data.programme) {
    return <NotFoundPage />;
  }

  if (i18n.language === "se" && !data?.programme.supportedLanguages?.includes("se")) {
    return <RedirectExternal to={constructNewPath(location.pathname, "nb")} />;
  }

  const selectedGrade =
    data.programme.grades?.find((g) => g.title.title.toLowerCase() === grade) ?? data.programme.grades?.[0];

  return (
    <ProgrammeContainer programme={data.programme} grade={selectedGrade?.title.title || ""} locale={i18n.language} />
  );
};

export const Component = ProgrammePage;
