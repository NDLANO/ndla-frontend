/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ReactNode } from "react";
import { useLocation, useHref } from "react-router";
import config from "../config";
import { isValidLocale, preferredLanguages } from "../i18n";

export const buildFullUrlFromPath = (path: string) => {
  return `${config.ndlaFrontendDomain}${path}`;
};

export const languagePartIndex = (parts: string[]) => {
  return parts.includes("article-iframe") ? 2 : 1;
};

// NOTE: Builds the `<link rel="canonical">` URL. Only the `nb` prefix is stripped
// because bokmål is our default language and is served without a path segment;
// other locales (`nn`, `en`, …) must remain in the URL so each language variant
// has its own canonical and is indexed as a distinct page by search engines.
export const getCanonicalUrl = (pathname: string) => {
  const parts = pathname.split("/");
  const langIdx = languagePartIndex(parts);
  if (parts[langIdx] === config.defaultLocale) {
    parts.splice(langIdx, 1);
  }

  return buildFullUrlFromPath(parts.join("/"));
};

// NOTE: Builds the `<link rel="alternate" hrefLang>` URL for a given language.
// Any existing locale segment is removed and `alternateLanguage` is inserted in
// its place so search engines can discover all language variants of a page from
// any one of them.
export const getAlternateUrl = (pathname: string, alternateLanguage: string) => {
  const parts = pathname.split("/");
  const langIdx = languagePartIndex(parts);
  if (isValidLocale(parts[langIdx])) {
    parts.splice(langIdx, 1);
  }
  parts.splice(langIdx, 0, alternateLanguage);
  return buildFullUrlFromPath(parts.join("/"));
};

export const getAlternateLanguages = (trackableContent?: TrackableContent) => {
  return trackableContent?.supportedLanguages?.filter((lng) => isValidLocale(lng)) ?? preferredLanguages;
};

interface TrackableContent {
  supportedLanguages?: string[];
}

interface BaseProps {
  title: string;
  description?: string;
  imageUrl?: string;
  audioUrl?: string;
  trackableContent?: TrackableContent;
  children?: ReactNode;
  type?: string;
}

interface WithCanonicalPath extends BaseProps {
  canonicalPath: string | undefined;
  useLocationForCanonicalPath?: false;
}

interface WithLocationForCanonicalPath extends BaseProps {
  canonicalPath?: undefined;
  useLocationForCanonicalPath: true;
}

type Props = WithCanonicalPath | WithLocationForCanonicalPath;

export const SocialMediaMetadata = ({
  title,
  imageUrl,
  audioUrl,
  description,
  trackableContent,
  children,
  canonicalPath,
  type = "article",
}: Props) => {
  const location = useLocation();
  const hrefLocation = canonicalPath ? { pathname: canonicalPath } : location;
  const href = useHref(hrefLocation);
  const canonicalUrl = getCanonicalUrl(href);

  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      {getAlternateLanguages(trackableContent).map((alternateLanguage) => {
        const alternateUrl = getAlternateUrl(canonicalPath ?? location.pathname, alternateLanguage);
        return <link key={alternateLanguage} rel="alternate" hrefLang={alternateLanguage} href={alternateUrl} />;
      })}
      {children}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      {!!title && <meta property="og:title" content={`${title} - NDLA`} />}
      {!!description && <meta property="og:description" content={description} />}
      {!!description && <meta name="description" content={description} />}
      {!!audioUrl && <meta property="og:audio" content={audioUrl} />}
      {!!imageUrl && <meta property="og:image" content={imageUrl} />}
      {!imageUrl ? <meta property="og:image" content={`${config.ndlaFrontendDomain}/static/metaimage.png`} /> : ""}
      <meta property="og:site_name" content="ndla.no" />
    </>
  );
};
