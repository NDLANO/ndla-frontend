/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../../../components/AuthenticationContext";
import { PageSpinner } from "../../../components/PageSpinner";
import { routes } from "../../../routeHelpers";
import { ForbiddenPage } from "../../ErrorPage/ForbiddenPage";

export const LearningpathCheck = () => {
  const { t } = useTranslation();
  const { authContextLoaded, authenticated, user } = useContext(AuthContext);

  if (!authContextLoaded) return <PageSpinner />;

  if (!authenticated || !user || user.role !== "employee") {
    return <ForbiddenPage navigationLink={{ to: routes.myNdla.root, children: t("myNdla.goToMyNdla") }} />;
  }

  return <Outlet />;
};
