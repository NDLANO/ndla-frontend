/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { isValidLocale } from "../i18n";
import { log } from "../util/logger/logger";
import { getAllDimensions } from "../util/trackingUtil";
import { AuthContext } from "./AuthenticationContext";
import { buildFullUrlFromPath, languagePartIndex } from "./SocialMediaMetadata";

interface BaseProps {
  title: string;
}

interface TrackingProps {
  defaultUrl?: string;
  rootId?: string;
  context?: {
    rootId?: string;
    defaultUrl?: string;
  };
}

interface WithTrackingProps extends BaseProps {
  trackingProps: TrackingProps;
  useLocationForCustomPath?: false;
}

interface WithNoTrackingProps extends BaseProps {
  trackingProps?: never;
  useLocationForCustomPath: true;
}

type Props = WithTrackingProps | WithNoTrackingProps;

// NOTE: Builds the path sent as `CustomPath` (and `CustomUrl`) on matomo `Pageview` events.
// Every locale segment is stripped (unlike `getCanonicalUrl`, which only strips `nb`) so that every language
// variant of the same page collapses onto a single entry in matomo.
// This lets us track a page's traffic as one page regardless of the visited language.
export const getTrackedPath = (pathname: string) => {
  const parts = pathname.split("/");
  const langIdx = languagePartIndex(parts);
  if (isValidLocale(parts[langIdx])) {
    parts.splice(langIdx, 1);
  }

  return parts.join("/");
};

/**
 * A component for setting the page title and tracking a page view event.
 * @param title - The title of the page. Will update the document title tag and dispatch a page view event. The component expects this title to be stable for the lifetime of the page, meaning it should not change unless the page location changes.
 * @param trackingProps - Optional tracking metadata for the page view event. `defaultUrl` overrides the path used for tracking instead of the current location; `rootId` is sent as the `subjectId` dimension. Either value may also be supplied nested under `context` to accept a GraphQL `TaxonomyContext` directly.
 */
export const PageTitle = ({ title, trackingProps }: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { i18n } = useTranslation();
  const hasTracked = useRef(false);

  const location = useLocation();
  const customPath = trackingProps?.defaultUrl ?? trackingProps?.context?.defaultUrl;
  const subjectId = trackingProps?.rootId ?? trackingProps?.context?.rootId;
  const rawPath = customPath ?? location.pathname;
  const trackedPath = getTrackedPath(rawPath);
  const trackedUrl = buildFullUrlFromPath(trackedPath);

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
      CustomPath: trackedPath,
      languageCode: i18n.language,
      subjectId,
      ...dimensions,
    });
    hasTracked.current = true;
  }, [authContextLoaded, title, trackedUrl, trackedPath, user, subjectId, i18n.language]);

  return <title>{title}</title>;
};
