/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Text } from "@ndla/primitives";
import { useTranslation } from "react-i18next";
import { MyNdlaTitle } from "../../../components/MyNdla/MyNdlaTitle";
import { PageTitle } from "../../../components/PageTitle";
import { PrivateRoute } from "../../PrivateRoute/PrivateRoute";
import { MyNdlaPageSection, MyNdlaPageContent } from "../components/MyNdlaPageSection";
import { MyNdlaPageWrapper } from "../components/MyNdlaPageWrapper";
import { PageActions } from "../components/PageActions";
import { useLearningpathActionHooks } from "./components/LearningpathActionHooks";
import { LearningpathList } from "./components/LearningpathList";

export const Component = () => {
  return <PrivateRoute element={<LearningpathPage />} />;
};

export const LearningpathPage = () => {
  const { t } = useTranslation();
  const menuItems = useLearningpathActionHooks();

  return (
    <MyNdlaPageWrapper>
      <PageTitle title={t("htmlTitles.learningpathsPage")} />
      <MyNdlaPageContent>
        <MyNdlaTitle title={t("myNdla.learningpath.title")} />
        <Text>{t("myNdla.learningpath.description")}</Text>
      </MyNdlaPageContent>
      <MyNdlaPageSection>
        <PageActions actions={menuItems} />
        <LearningpathList />
      </MyNdlaPageSection>
    </MyNdlaPageWrapper>
  );
};
