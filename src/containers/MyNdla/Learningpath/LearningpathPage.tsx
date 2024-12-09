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
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const LearningpathPage = () => {
  const { t } = useTranslation();
  const { trackPageView } = useTracker();
  const { user } = useContext(AuthContext);
  const menuItems = useLearningpathActionHooks();

  useEffect(() => {
    trackPageView({ title: t("htmlTitles.learningpathPage"), dimensions: getAllDimensions({ user }) });
  }, [t, trackPageView, user]);

  return (
    <MyNdlaPageWrapper menuItems={menuItems}>
      <HelmetWithTracker title={t("htmlTitles.learningpathPage")} />
      <Heading id={SKIP_TO_CONTENT_ID} textStyle="heading.medium">
        {t("myNdla.learningpath.title")}
      </Heading>
      <Text>{t("myNdla.learningpath.description")}</Text>
      <LearningpathList />
    </MyNdlaPageWrapper>
  );
};

export default LearningpathPage;
