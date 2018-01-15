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
  constants,
  ContentTypeBadge,
  ToggleLicenseBox,
} from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import LicenseBox from './license/LicenseBox';

const TopicArticle = ({ article, children, locale, t }) => {
  if (!article) {
    return children || null;
  }

  return (
    <UIArticle
      article={article}
      icon={
        <ContentTypeBadge
          type={constants.contentTypes.SUBJECT}
          background
          size="large"
        />
      }
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
        label: t('topic'),
      }}>
      <a
        className="article-old-ndla-link"
        rel="noopener noreferrer"
        target="_blank"
        href={article.oldNdlaUrl}>
        Gå til orginal artikkel
      </a>
      {children}
    </UIArticle>
  );
};

TopicArticle.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    copyright: PropTypes.shape({
      authors: PropTypes.array,
      creators: PropTypes.array,
    }).isRequired,
  }),
  children: PropTypes.node,
  locale: PropTypes.string.isRequired,
};

export default injectT(TopicArticle, 'article.');
