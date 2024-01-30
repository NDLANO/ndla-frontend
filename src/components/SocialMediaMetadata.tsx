/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, Location, useParams } from 'react-router-dom';
import config from '../config';
import { preferredLocales, isValidLocale } from '../i18n';

export const getCanonicalUrl = (location: Location) => {
  if (!location.pathname.includes('article-iframe')) {
    return `${config.ndlaFrontendDomain}${location.pathname}`;
  }
  const paths = location.pathname.split('/');
  if (isValidLocale(paths[2])) {
    paths.splice(2, 1);
  }
  return `${config.ndlaFrontendDomain}${paths.join('/')}`;
};

export const getAlternateUrl = (
  location: Location,
  alternateLanguage: string,
) => {
  if (!location.pathname.includes('article-iframe')) {
    return `${config.ndlaFrontendDomain}/${alternateLanguage}${location.pathname}`;
  }
  const paths = location.pathname.split('/');
  if (isValidLocale(paths[2])) {
    paths.splice(2, 1);
  }
  paths.splice(2, 0, alternateLanguage);
  return `${config.ndlaFrontendDomain}${paths.join('/')}`;
};

export const getAlternateLanguages = (trackableContent?: TrackableContent) => {
  if (!trackableContent || !trackableContent.supportedLanguages) {
    return preferredLocales.map((appLocale) => appLocale.abbreviation);
  }
  if (trackableContent?.supportedLanguages?.length === 0) {
    return [];
  }
  return trackableContent.supportedLanguages.filter((language) =>
    isValidLocale(language),
  );
};

export const getOgUrl = (location: Location, basename?: string) => {
  const ogBaseName = !basename?.length ? '' : `/${basename}`;
  return `${config.ndlaFrontendDomain}${ogBaseName}${location.pathname}`;
};

interface TrackableContent {
  tags?: string[];
  supportedLanguages?: string[];
}

interface Props {
  title: string;
  description?: string;
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
  trackableContent,
  children,
  type = 'article',
}: Props) => {
  const location = useLocation();
  const { lang } = useParams();
  return (
    <Helmet>
      <link rel="canonical" href={getCanonicalUrl(location)} />
      {getAlternateLanguages(trackableContent).map((alternateLanguage) => (
        <link
          key={alternateLanguage}
          rel="alternate"
          hrefLang={alternateLanguage}
          href={getAlternateUrl(location, alternateLanguage)}
        />
      ))}
      {children}
      {trackableContent?.tags && (
        <meta property="keywords" content={`${trackableContent?.tags}`} />
      )}
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@ndla_no" />
      <meta name="twitter:creator" content="@ndla_no" />
      <meta property="og:url" content={getOgUrl(location, lang)} />
      {title && <meta property="og:title" content={`${title} - NDLA`} />}
      {title && <meta name="twitter:title" content={`${title} - NDLA`} />}
      {description && <meta property="og:description" content={description} />}
      {description && <meta name="description" content={description} />}
      {description && <meta name="twitter:description" content={description} />}
      {audioUrl && <meta property="og:audio" content={audioUrl} />}
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      {imageUrl && <meta name="twitter:image:src" content={imageUrl} />}
      {!imageUrl ? (
        <meta
          name="twitter:image:src"
          content={`${config.ndlaFrontendDomain}/static/metalogo.jpg`}
        />
      ) : (
        ''
      )}
      {!imageUrl ? (
        <meta
          property="og:image"
          content={`${config.ndlaFrontendDomain}/static/metalogo.jpg`}
        />
      ) : (
        ''
      )}
      <meta property="og:site_name" content="ndla.no" />
    </Helmet>
  );
};

export default SocialMediaMetadata;
