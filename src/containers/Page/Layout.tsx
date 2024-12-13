/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import { useComponentSize } from "@ndla/hooks";
import { Footer } from "./components/Footer";
import TitleAnnouncer from "./components/TitleAnnouncer";
import { PageLayout } from "../../components/Layout/PageContainer";
import { defaultValue, useVersionHash } from "../../components/VersionHashContext";
import { usePrevious } from "../../util/utilityHooks";
import Masthead from "../Masthead";

const Layout = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { height } = useComponentSize("masthead");
  const prevPathname = usePrevious(pathname);
  const htmlRef = useRef<HTMLHtmlElement | null>(null);

  useEffect(() => {
    if (!prevPathname || pathname === prevPathname) {
      return;
    }
    const searchUpdate = pathname === "/search" && prevPathname === "/search";
    if (!searchUpdate) {
      window.scrollTo(0, 0);
    }
  }, [pathname, prevPathname]);

  useEffect(() => {
    if (!htmlRef.current) {
      htmlRef.current = document.querySelector("html");
    } else {
      htmlRef.current.style.scrollPaddingTop = `${height}px`;
    }
  }, [height]);

  const mastheadHeightVar = useMemo(() => ({ "--masthead-height": `${height}px` }) as CSSProperties, [height]);

  const hash = useVersionHash();
  const isDefaultVersion = hash === defaultValue;
  const metaChildren = isDefaultVersion ? null : <meta name="robots" content="noindex, nofollow" />;

  return (
    <>
      <TitleAnnouncer />
      {metaChildren}
      <meta name="description" content={t("meta.description")} />
      <Masthead />
      <PageLayout style={mastheadHeightVar}>
        <Outlet />
      </PageLayout>
      <Footer />
    </>
  );
};
export default Layout;
