/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, Location } from "react-router-dom";
import { useBaseName } from "./BaseNameContext";
import config from "../config";
import { preferredLocales, isValidLocale } from "../i18n";

export const getCanonicalUrl = (pathname: string) => {
  if (!pathname.includes("article-iframe")) {
    return `${config.ndlaFrontendDomain}${pathname}`;
  }
  const paths = pathname.split("/");
  if (isValidLocale(paths[2])) {
    paths.splice(2, 1);
  }
  return `${config.ndlaFrontendDomain}${paths.join("/")}`;
};

export const getAlternateUrl = (pathname: string, alternateLanguage: string) => {
  if (!pathname.includes("article-iframe")) {
    return `${config.ndlaFrontendDomain}/${alternateLanguage}${pathname}`;
  }
  const paths = pathname.split("/");
  if (isValidLocale(paths[2])) {
    paths.splice(2, 1);
  }
  paths.splice(2, 0, alternateLanguage);
  return `${config.ndlaFrontendDomain}${paths.join("/")}`;
};

export const getAlternateLanguages = (trackableContent?: TrackableContent) => {
  if (!trackableContent || !trackableContent.supportedLanguages) {
    return preferredLocales.map((appLocale) => appLocale.abbreviation);
  }
  if (trackableContent?.supportedLanguages?.length === 0) {
    return [];
  }
  return trackableContent.supportedLanguages.filter((language) => isValidLocale(language));
};

export const getOgUrl = (location: Pick<Location, "pathname">, basename: string) => {
  const ogBaseName = basename === "" ? "" : `/${basename}`;
  return `${config.ndlaFrontendDomain}${ogBaseName}${location.pathname}`;
};

interface TrackableContent {
  supportedLanguages?: string[];
}

interface Props {
  title: string;
  description?: string;
  path?: string;
  imageUrl?: string;
  audioUrl?: string;
  trackableContent?: TrackableContent;
  children?: ReactNode;
  type?: string;
}

const SocialMediaMetadata = ({
  title,
  imageUrl,
  audioUrl,
  description,
  path,
  trackableContent,
  children,
  type = "article",
}: Props) => {
  const location = useLocation();
  const basename = useBaseName();
  return (
    <Helmet>
      <link rel="canonical" href={getCanonicalUrl(path ? path : location.pathname)} />
      {getAlternateLanguages(trackableContent).map((alternateLanguage) => (
        <link
          key={alternateLanguage}
          rel="alternate"
          hrefLang={alternateLanguage}
          href={getAlternateUrl(path ? path : location.pathname, alternateLanguage)}
        />
      ))}
      {children}
      <meta property="og:type" content={type} />
      <meta name="twitter:site" content="@ndla_no" />
      <meta name="twitter:creator" content="@ndla_no" />
      <meta property="og:url" content={getOgUrl(location, basename)} />
      {!!title && <meta property="og:title" content={`${title} - NDLA`} />}
      {!!description && <meta property="og:description" content={description} />}
      {!!description && <meta name="description" content={description} />}
      {!!audioUrl && <meta property="og:audio" content={audioUrl} />}
      {!!imageUrl && <meta property="og:image" content={imageUrl} />}
      {!imageUrl ? <meta property="og:image" content={`${config.ndlaFrontendDomain}/static/metaimage.png`} /> : ""}
      <meta property="og:site_name" content="ndla.no" />
    </Helmet>
  );
};

export default SocialMediaMetadata;
