/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { isValidLocale } from "../i18n";
import { log } from "../util/logger/logger";
import { getAllDimensions } from "../util/trackingUtil";
import { AuthContext } from "./AuthenticationContext";
import { buildFullUrlFromPath, languagePartIndex } from "./SocialMediaMetadata";

interface BaseProps {
  title: string;
}

interface WithCustomUrl extends BaseProps {
  customPath: string | undefined;
  useLocationForCustomPath?: false;
}

interface WithLocationForCustomUrl extends BaseProps {
  customPath?: undefined;
  useLocationForCustomPath: true;
}

type Props = WithCustomUrl | WithLocationForCustomUrl;

export const getTrackedUrl = (pathname: string) => {
  const parts = pathname.split("/");
  const langIdx = languagePartIndex(parts);
  if (isValidLocale(parts[langIdx])) {
    parts.splice(langIdx, 1);
  }

  return buildFullUrlFromPath(parts.join("/"));
};

/**
 * A component for setting the page title and tracking a page view event.
 * @param title - The title of the page. Will update the document title tag and dispatch a page view event. The component expects this title to be stable for the lifetime of the page, meaning it should not change unless the page location changes.
 * @param customPath - Optional path to use for page view tracking instead of the canonical URL derived from the current location. Mutually exclusive with `useLocationForCustomPath`.
 * @param useLocationForCustomPath - When true, derives the tracked path from the current location's canonical URL. Mutually exclusive with `customUrl`.
 */
export const PageTitle = ({ title, customPath }: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const hasTracked = useRef(false);

  const location = useLocation();
  const trackedPath = customPath ?? location.pathname;
  const trackedUrl = getTrackedUrl(trackedPath);

  useEffect(() => {
    hasTracked.current = false;
  }, [trackedUrl]);

  useEffect(() => {
    if (!authContextLoaded) return;
    if (hasTracked.current) {
      log.info("PageTitle: Page view already tracked, skipping duplicate tracking. This should not happen");
      return;
    }
    const dimensions = getAllDimensions({ user });
    window._mtm?.push({
      page_title: title,
      event: "Pageview",
      CustomUrl: trackedUrl,
      ...dimensions,
    });
    hasTracked.current = true;
  }, [authContextLoaded, title, trackedUrl, user]);

  return <title>{title}</title>;
};
