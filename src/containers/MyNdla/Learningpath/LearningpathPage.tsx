/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Heading, Text } from "@ndla/primitives";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { useLearningpathActionHooks } from "./components/LearningpathActionHooks";
import { LearningpathList } from "./components/LearningpathList";
import { AuthContext } from "../../../components/AuthenticationContext";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { getAllDimensions } from "../../../util/trackingUtil";
import PrivateRoute from "../../PrivateRoute/PrivateRoute";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

export const Component = () => {
  return <PrivateRoute element={<LearningpathPage />} />;
};

export const LearningpathPage = () => {
  const { t } = useTranslation();
  const { trackPageView } = useTracker();
  const { user } = useContext(AuthContext);
  const menuItems = useLearningpathActionHooks();

  useEffect(() => {
    trackPageView({ title: t("htmlTitles.learningpathsPage"), dimensions: getAllDimensions({ user }) });
  }, [t, trackPageView, user]);

  return (
    <MyNdlaPageWrapper menuItems={menuItems} type="learningpath">
      <HelmetWithTracker title={t("htmlTitles.learningpathsPage")} />
      <Heading id={SKIP_TO_CONTENT_ID} textStyle="heading.medium">
        {t("myNdla.learningpath.title")}
      </Heading>
      <Text>{t("myNdla.learningpath.description")}</Text>
      <LearningpathList />
    </MyNdlaPageWrapper>
  );
};
