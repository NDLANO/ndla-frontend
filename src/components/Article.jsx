/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import {
  Article as UIArticle,
  ContentTypeBadge,
  ToggleLicenseBox,
} from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import LicenseBox from './license/LicenseBox';
import getContentTypeFromResourceTypes from './getContentTypeFromResourceTypes';

const Article = ({ article, children, locale, t }) => {
  const hasResourceTypes =
    article.resourceTypes && article.resourceTypes.length > 0;

  const contentType = hasResourceTypes
    ? getContentTypeFromResourceTypes(article.resourceTypes).contentType
    : undefined;

  const label = hasResourceTypes ? article.resourceTypes[0].name : '';
  const icon = contentType ? (
    <ContentTypeBadge type={contentType} background size="large" />
  ) : null;

  return (
    <UIArticle
      article={article}
      icon={icon}
      licenseBox={
        <ToggleLicenseBox
          article={article}
          locale={locale}
          openTitle={t('openLicenseBox')}
          closeTitle={t('closeLicenseBox')}>
          <LicenseBox article={article} locale={locale} />
        </ToggleLicenseBox>
      }
      messages={{
        lastUpdated: t('lastUpdated'),
        edition: t('edition'),
        publisher: t('publisher'),
        label,
      }}>
      {children}
      <a
        className="article-old-ndla-link"
        rel="noopener noreferrer"
        target="_blank"
        href={article.oldNdlaUrl}>
        Gå til orginal artikkel
      </a>
    </UIArticle>
  );
};

Article.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    copyright: PropTypes.shape({
      authors: PropTypes.array,
      creators: PropTypes.array,
    }).isRequired,
  }).isRequired,
  children: PropTypes.node,
  locale: PropTypes.string.isRequired,
};

export default injectT(Article, 'article.');
