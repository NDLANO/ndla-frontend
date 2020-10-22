/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { BasenameContext } from '../App';
import config from '../config';
import {
  LocationShape,
  MetaImageShape,
  ArticleShape,
  LearningpathShape,
} from '../shapes';
import { getHtmlLang, appLocales, isValidLocale } from '../i18n';

export const getCanonicalUrl = location => {
  if (!location.pathname.includes('article-iframe')) {
    return `${config.ndlaFrontendDomain}${location.pathname}`;
  }
  const paths = location.pathname.split('/');
  if (isValidLocale(paths[2])) {
    paths.splice(2, 1);
  }
  return `${config.ndlaFrontendDomain}${paths.join('/')}`;
};

export const getAlternateUrl = (location, alternateLanguage) => {
  if (!location.pathname.includes('article-iframe')) {
    return `${config.ndlaFrontendDomain}/${alternateLanguage}${location.pathname}`;
  }
  const paths = location.pathname.split('/');
  if (isValidLocale(paths[2])) {
    paths.splice(2, 1);
  }
  paths.splice(2, 0, [alternateLanguage]);
  return `${config.ndlaFrontendDomain}${paths.join('/')}`;
};

export const getAlternateLanguages = (basename, locale, trackableContent) => {
  const defaultLocale = getHtmlLang();
  const isBasenamePage = locale === defaultLocale && basename === '';
  if (!trackableContent && isBasenamePage) {
    return appLocales.map(appLocale => appLocale.abbreviation);
  }
  if (
    (!trackableContent && !isBasenamePage) ||
    !isBasenamePage ||
    trackableContent?.supportedLanguages?.length === 0
  ) {
    return [];
  }
  return trackableContent.supportedLanguages.filter(
    language => !!isValidLocale(language),
  );
};

export const SocialMediaMetadata = ({
  title,
  image,
  description,
  locale,
  trackableContent,
  location,
  children,
}) => (
  <BasenameContext.Consumer>
    {basename => (
      <Helmet>
        <link rel="canonical" href={getCanonicalUrl(location)} />
        {getAlternateLanguages(basename, locale, trackableContent).map(
          alternateLanguage => (
            <link
              key={alternateLanguage}
              rel="alternate"
              hrefLang={alternateLanguage}
              href={getAlternateUrl(location, alternateLanguage)}
            />
          ),
        )}
        {children}
        {trackableContent?.tags && (
          <meta property="keywords" content={`${trackableContent?.tags}`} />
        )}
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ndla_no" />
        <meta name="twitter:creator" content="@ndla_no" />
        <meta
          property="og:url"
          content={`${config.ndlaFrontendDomain}${location.pathname}`}
        />
        {title && <meta property="og:title" content={`${title} - NDLA`} />}
        {title && <meta name="twitter:title" content={`${title} - NDLA`} />}
        {description && (
          <meta property="og:description" content={description} />
        )}
        {description && (
          <meta name="twitter:description" content={description} />
        )}
        {image?.url && <meta property="og:image" content={image.url} />}
        {image?.url && <meta name="twitter:image:src" content={image.url} />}
        {!image || !image.url ? (
          <meta
            name="twitter:image:src"
            content={`${config.ndlaFrontendDomain}/static/metalogo.jpg`}
          />
        ) : (
          ''
        )}
        {!image || !image.url ? (
          <meta
            property="og:image"
            content={`${config.ndlaFrontendDomain}/static/metalogo.jpg`}
          />
        ) : (
          ''
        )}
        <meta property="og:site_name" content="ndla.no" />
        <meta
          property="article:publisher"
          content="https://www.facebook.com/ndla.no"
        />
        <meta
          property="article:author"
          content="https://www.facebook.com/ndla.no"
        />
      </Helmet>
    )}
  </BasenameContext.Consumer>
);

SocialMediaMetadata.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  locale: PropTypes.string,
  location: LocationShape,
  image: MetaImageShape,
  trackableContent: PropTypes.oneOfType([ArticleShape, LearningpathShape]),
};

export default withRouter(SocialMediaMetadata);
