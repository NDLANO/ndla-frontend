/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties, useEffect, useMemo, useRef } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { useComponentSize } from "@ndla/hooks";
import { Footer } from "./components/Footer";
import TitleAnnouncer from "./components/TitleAnnouncer";
import { PageLayout } from "../../components/Layout/PageContainer";
import { defaultValue, useVersionHash } from "../../components/VersionHashContext";
import { routes } from "../../routeHelpers";
import { useIsMastheadSticky } from "../../util/useIsMastheadSticky";
import { usePrevious } from "../../util/utilityHooks";
import Masthead from "../Masthead";

const Layout = () => {
  const { pathname } = useLocation();
  const { learningpathId, stepId } = useParams();
  const { height } = useComponentSize("masthead");
  const prevPathname = usePrevious(pathname);
  const htmlRef = useRef<HTMLHtmlElement | null>(null);
  const isSticky = useIsMastheadSticky();

  useEffect(() => {
    if (!prevPathname || pathname === prevPathname) {
      return;
    }
    const searchUpdate = pathname === "/search" && prevPathname === "/search";
    const learningpathStepUpdate =
      pathname === routes.myNdla.learningpathEditSteps(Number(learningpathId)) ||
      (stepId && routes.myNdla.learningpathEditStep(Number(learningpathId), stepId));

    if (!searchUpdate && !learningpathStepUpdate) {
      window.scrollTo(0, 0);
    }
  }, [learningpathId, pathname, prevPathname, stepId]);

  useEffect(() => {
    if (!htmlRef.current) {
      htmlRef.current = document.querySelector("html");
    } else if (isSticky) {
      htmlRef.current.style.scrollPaddingTop = `${height}px`;
    }
  }, [height, isSticky]);

  const mastheadHeightVar = useMemo(() => ({ "--masthead-height": `${height}px` }) as CSSProperties, [height]);

  const hash = useVersionHash();
  const isDefaultVersion = hash === defaultValue;
  const metaChildren = isDefaultVersion ? null : <meta name="robots" content="noindex, nofollow" />;

  return (
    <>
      <TitleAnnouncer />
      {metaChildren}
      <Masthead showAlerts />
      <PageLayout style={mastheadHeightVar}>
        <Outlet />
      </PageLayout>
      <Footer />
    </>
  );
};
export default Layout;
