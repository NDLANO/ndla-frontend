/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { matchPath, Outlet, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { useComponentSize } from "@ndla/hooks";
import { PageContainer } from "@ndla/ui";
import Footer from "./components/Footer";
import TitleAnnouncer from "./components/TitleAnnouncer";
import { defaultValue, useVersionHash } from "../../components/VersionHashContext";
import { routes, useUrnIds } from "../../routeHelpers";
import { usePrevious } from "../../util/utilityHooks";
import Masthead from "../Masthead";

const BottomPadding = styled.div`
  padding-bottom: ${spacing.large};
  &[data-no-padding="true"] {
    padding-bottom: unset;
  }
`;

const Layout = () => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const { height } = useComponentSize("masthead");
  const prevPathname = usePrevious(pathname);
  const htmlRef = useRef<HTMLHtmlElement | null>(null);
  const params = useUrnIds();
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

  useEffect(() => {
    if (!htmlRef.current) {
      htmlRef.current = document.querySelector("html");
    } else {
      htmlRef.current.style.scrollPaddingTop = `${height}px`;
    }
  }, [height]);

  const hash = useVersionHash();
  const isDefaultVersion = hash === defaultValue;
  const metaChildren = isDefaultVersion ? null : <meta name="robots" content="noindex, nofollow" />;

  return (
    <PageContainer backgroundWide={backgroundWide} data-frontpage={frontpage}>
      <TitleAnnouncer />
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
    </PageContainer>
  );
};
export default Layout;
