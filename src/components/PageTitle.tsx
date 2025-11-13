/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect, useRef } from "react";
import { useHref, useLocation } from "react-router";
import { AuthContext } from "./AuthenticationContext";
import { log } from "../util/logger/logger";
import { getAllDimensions } from "../util/trackingUtil";

interface Props {
  title: string;
}

/**
 * A component for setting the page title and tracking a page view event.
 * @param title - The title of the page. Will update the document title tag and dispatch a page view event. The component expects this title to be stable for the lifetime of the page, meaning it should not change unless the page location changes.
 */
export const PageTitle = ({ title }: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const hasTracked = useRef(false);

  const location = useLocation();
  const href = useHref(location);

  useEffect(() => {
    hasTracked.current = false;
  }, [href]);

  useEffect(() => {
    if (!authContextLoaded) return;
    if (hasTracked.current) {
      log.info("PageTitle: Page view already tracked, skipping duplicate tracking. This should not happen");
      return;
    }
    // for debugging purposes
    // log.info(`PageTitle: Tracking page view with title: ${title}`);
    const dimensions = getAllDimensions({ user });
    window._mtm?.push({
      page_title: title,
      event: "Pageview",
      ...dimensions,
    });
    hasTracked.current = true;
  }, [authContextLoaded, title, user]);

  return <title>{title}</title>;
};
