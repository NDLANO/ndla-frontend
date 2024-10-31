/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { Heading } from "@ndla/primitives";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { AuthContext } from "../../../components/AuthenticationContext";
import { PageSpinner } from "../../../components/PageSpinner";
import config from "../../../config";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const LearningPathPage = () => {
  const { t } = useTranslation();
  const { trackPageView } = useTracker();
  const { authContextLoaded, authenticated, user } = useContext(AuthContext);

  useEffect(() => {
    if (!authContextLoaded) return;
    trackPageView({ title: t("htmlTitles.learningpathPage"), dimensions: getAllDimensions({ user }) });
  }, [authContextLoaded, t, trackPageView, user]);

  if (!authContextLoaded) return <PageSpinner />;
  if (!authenticated || !config.learningpathEnabled || (user && !(user.role === "employee")))
    return <Navigate to={routes.myNdla.root} />;

  return (
    <MyNdlaPageWrapper>
      <HelmetWithTracker title={t("htmlTitles.learningpathPage")} />
      <Heading id={SKIP_TO_CONTENT_ID} textStyle="heading.medium">
        {t("myNdla.learningpath.title")}
      </Heading>
    </MyNdlaPageWrapper>
  );
};

export default LearningPathPage;
