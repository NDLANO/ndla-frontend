/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AddLine } from "@ndla/icons/action";
import { Heading, Spinner, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { LearningPathListItem } from "./components/LearningPathListItem";
import { AuthContext } from "../../../components/AuthenticationContext";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";
import { useMyLearningpaths } from "../learningpathApi";

const LearningpathList = styled("ol", {
  base: {},
});

const LearningPathPage = () => {
  const { t } = useTranslation();
  const { trackPageView } = useTracker();
  const { user } = useContext(AuthContext);
  const { learningpaths, loading } = useMyLearningpaths();

  useEffect(() => {
    trackPageView({ title: t("htmlTitles.learningpathPage"), dimensions: getAllDimensions({ user }) });
  }, [t, trackPageView, user]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <MyNdlaPageWrapper
      menuItems={[
        {
          type: "link",
          link: routes.myNdla.learningpathNew,
          icon: <AddLine />,
          text: t("myNdla.learningpath.menu.new"),
          value: t("myNdla.learningpath.menu.new"),
        },
      ]}
    >
      <HelmetWithTracker title={t("htmlTitles.learningpathPage")} />
      <Heading id={SKIP_TO_CONTENT_ID} textStyle="heading.medium">
        {t("myNdla.learningpath.title")}
      </Heading>
      <Text>{t("myNdla.learningpath.description")}</Text>
      <LearningpathList>
        {learningpaths?.map((learningpath) => (
          <LearningPathListItem showMenu learningPath={learningpath} key={learningpath.id} />
        ))}
      </LearningpathList>
    </MyNdlaPageWrapper>
  );
};

export default LearningPathPage;
