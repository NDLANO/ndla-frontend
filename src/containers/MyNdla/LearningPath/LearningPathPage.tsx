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
import { Heading } from "@ndla/primitives";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { AuthContext } from "../../../components/AuthenticationContext";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";
import { MenuItemProps } from "../components/SettingsMenu";

const LearningPathPage = () => {
  const { t } = useTranslation();
  const { trackPageView } = useTracker();
  const { user } = useContext(AuthContext);

  const menuItems: MenuItemProps[] = [
    {
      type: "link",
      value: "newFolder",
      icon: <AddLine size="small" />,
      text: t("myNdla.newFolderShort"),
      link: "new",
    },
  ];

  useEffect(() => {
    trackPageView({ title: t("htmlTitles.learningpathPage"), dimensions: getAllDimensions({ user }) });
  }, [t, trackPageView, user]);

  return (
    <MyNdlaPageWrapper menuItems={menuItems}>
      <HelmetWithTracker title={t("htmlTitles.learningpathPage")} />
      <Heading id={SKIP_TO_CONTENT_ID} textStyle="heading.medium">
        {t("myNdla.learningpath.title")}
      </Heading>
    </MyNdlaPageWrapper>
  );
};

export default LearningPathPage;
