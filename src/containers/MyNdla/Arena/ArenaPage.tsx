/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AddLine } from "@ndla/icons/action";
import { Button, Text, Heading } from "@ndla/primitives";
import { SafeLink, SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import SortableArenaCards from "./components/SortableArenaCards";
import { useArenaCategories } from "./components/temporaryNodebbHooks";
import { AuthContext } from "../../../components/AuthenticationContext";
import { PageSpinner } from "../../../components/PageSpinner";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { getAllDimensions } from "../../../util/trackingUtil";

const StyledPageContainer = styled(PageContainer, {
  base: {
    gap: "medium",
  },
});

export const ModeratorButtonWrapper = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    gap: "3xsmall",
  },
});

const ArenaPage = () => {
  const { t } = useTranslation();
  const { trackPageView } = useTracker();
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    trackPageView({
      title: t("htmlTitles.arenaPage"),
      dimensions: getAllDimensions({ user }),
    });
  }, [t, trackPageView, user]);

  if (loading) {
    return <PageSpinner />;
  }

  const menuItems: MenuItemProps[] = [
    {
      type: "link",
      value: "newCategory",
      icon: <AddLine size="small" />,
      text: t("myNdla.arena.admin.category.form.newCategory"),
      link: "category/new",
    },
  ];

  return (
    <StyledPageContainer>
      <HelmetWithTracker title={t("htmlTitles.arenaPage")} />
      <iframe title="Arena" src="https://grupper.staging.ndla.no" width="100%" height="1000" allowFullScreen />
    </StyledPageContainer>
  );
};

export default ArenaPage;
