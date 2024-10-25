/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { AuthContext } from "../../../components/AuthenticationContext";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const StyledMyNdlaPageWrapper = styled(MyNdlaPageWrapper, {
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
  const { user, authContextLoaded, authenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!authContextLoaded || !user?.arenaEnabled) return;
    trackPageView({
      title: t("htmlTitles.arenaPage"),
      dimensions: getAllDimensions({ user }),
    });
  }, [authContextLoaded, t, trackPageView, user]);

  if (!authenticated || (user && !user.arenaEnabled)) return <Navigate to={routes.myNdla.root} />;

  return (
    <StyledMyNdlaPageWrapper menuItems={[]}>
      <HelmetWithTracker title={t("htmlTitles.arenaPage")} />
      <iframe title="Arena" src="https://grupper.test.ndla.no" width="100%" height="1000" allowFullScreen />
    </StyledMyNdlaPageWrapper>
  );
};

export default ArenaPage;
