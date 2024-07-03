/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { matchPath, Outlet, useLocation } from "react-router-dom";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import { useComponentSize } from "@ndla/hooks";
import { PageContainer } from "@ndla/ui";
import FeideFooter from "./components/FeideFooter";
import Footer from "./components/Footer";
import TitleAnnouncer from "./components/TitleAnnouncer";
import { defaultValue, useVersionHash } from "../../components/VersionHashContext";
import config from "../../config";
import { routes, useIsNdlaFilm, useUrnIds } from "../../routeHelpers";
import { usePrevious } from "../../util/utilityHooks";
import Masthead from "../Masthead";

const BottomPadding = styled.div`
  padding-bottom: ${spacing.large};
  &[data-no-padding="true"] {
    padding-bottom: unset;
  }
`;

const StyledPageContainer = styled(PageContainer)`
  &[data-film="true"] {
    background-color: ${colors.ndlaFilm.filmColor};
  }
  &[data-frontpage="true"] {
    background-color: ${colors.background.lightBlue};
  }
`;

interface GlobalProps {
  height: number;
}

const StyledGlobal = styled(Global)<GlobalProps>`
  html {
    scroll-padding-top: ${({ height }) => (height ? `${height}px` : "unset")};
  }
`;

const Layout = () => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const { height } = useComponentSize("masthead");
  const prevPathname = usePrevious(pathname);
  const params = useUrnIds();
  const ndlaFilm = useIsNdlaFilm();
  const frontpage = !!matchPath("/", pathname);
  const backgroundWide = !!matchPath("/learningpaths/:learningpathId", pathname);
  const noPaddingBottom = !!matchPath(`${routes.myNdla.root}/*`, pathname) || frontpage;

  useEffect(() => {
    if (!prevPathname || pathname === prevPathname) {
      return;
    }
    const inSubjectOrTopic = params.subjectType !== "multiDisciplinary" && params.topicId && !params.resourceId;
    const inMulti = params.subjectType === "multiDisciplinary" && params.topicId && params.topicList.length !== 3;
    const searchUpdate = pathname === "/search" && prevPathname === "/search";
    if (!searchUpdate && !inSubjectOrTopic && !inMulti) {
      window.scrollTo(0, 0);
    }
  }, [params, pathname, prevPathname]);

  const hash = useVersionHash();
  const isDefaultVersion = hash === defaultValue;
  const metaChildren = isDefaultVersion ? null : <meta name="robots" content="noindex, nofollow" />;

  return (
    <StyledPageContainer backgroundWide={backgroundWide} data-frontpage={frontpage} data-film={ndlaFilm}>
      <TitleAnnouncer />
      <StyledGlobal height={height} styles={undefined} />
      <Helmet
        htmlAttributes={{ lang: i18n.language === "nb" ? "no" : i18n.language }}
        meta={[{ name: "description", content: t("meta.description") }]}
      >
        {metaChildren}
      </Helmet>
      <Masthead />
      <div>
        <BottomPadding data-no-padding={noPaddingBottom}>
          <Outlet />
        </BottomPadding>
      </div>
      <Footer />
      {config.feideEnabled && <FeideFooter />}
    </StyledPageContainer>
  );
};
export default Layout;
