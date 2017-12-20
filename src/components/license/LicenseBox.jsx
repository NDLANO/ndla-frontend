/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import defined from 'defined';
import Tabs from 'ndla-tabs';
import { injectT } from 'ndla-i18n';
import ImageLicenseList from './ImageLicenseList';
import AudioLicenseList from './AudioLicenseList';
import TextLicenseList from './TextLicenseList';
import VideoLicenseList from './VideoLicenseList';
import { ArticleShape } from '../../shapes';

function buildLicenseTabList(article, locale, t) {
  const images = defined(article.metaData.images, []);
  const audios = defined(article.metaData.audios, []);
  const brightcove = defined(article.metaData.brightcoves, []);

  const tabs = [];

  if (images.length > 0) {
    tabs.push({
      title: t('license.tabs.images'),
      content: <ImageLicenseList images={images} locale={locale} />,
    });
  }

  tabs.push({
    title: t('license.tabs.text'),
    content: (
      <TextLicenseList
        texts={[
          {
            copyright: article.copyright,
            created: article.created,
          },
        ]}
        locale={locale}
      />
    ),
  });

  if (audios.length > 0) {
    tabs.push({
      title: t('license.tabs.audio'),
      content: <AudioLicenseList audios={audios} locale={locale} />,
    });
  }

  if (brightcove.length > 0) {
    tabs.push({
      title: t('license.tabs.video'),
      content: <VideoLicenseList videos={brightcove} locale={locale} />,
    });
  }

  return tabs;
}

const LicenseBox = ({ article, locale, t }) => {
  const tabs = buildLicenseTabList(article, locale, t);
  return (
    <div>
      <h1 className="license__heading">{t('license.heading')}</h1>
      <Tabs tabs={tabs} />
    </div>
  );
};

LicenseBox.propTypes = {
  locale: PropTypes.string.isRequired,
  article: ArticleShape.isRequired,
};

export default injectT(LicenseBox);
