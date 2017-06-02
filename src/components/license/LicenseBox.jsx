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
import { injectT } from '../../i18n';
import ImageLicenseList from './ImageLicenseList';
import AudioLicenseList from './AudioLicenseList';
import TextLicenseList from './TextLicenseList';
import { ArticleShape } from '../../shapes';

function buildLicenseTabList(article, license, locale, t) {
  const images = defined(article.contentCopyrights.image, []);
  const audios = defined(article.contentCopyrights.audio, []);

  const tabs = [];

  if (images.length > 0) {
    tabs.push({
      title: t('license.tabs.images'),
      content: (
        <ImageLicenseList
          images={images}
          heading={t('license.images.heading')}
          description={t('license.images.description')}
          locale={locale}
        />
      ),
    });
  }

  tabs.push({
    title: t('license.tabs.texts'),
    content: (
      <TextLicenseList
        texts={[
          { type: 'text', src: location.href, copyright: article.copyright },
        ]}
        heading={t('license.texts.heading')}
        description={t('license.texts.description')}
        locale={locale}
      />
    ),
  });

  if (audios.length > 0) {
    tabs.push({
      title: t('license.tabs.audios'),
      content: (
        <AudioLicenseList
          audios={audios}
          heading={t('license.audios.heading')}
          locale={locale}
        />
      ),
    });
  }

  return tabs;
}

const LicenseBox = ({ article, license, locale, t }) => {
  const tabs = buildLicenseTabList(article, license, locale, t);
  return (
    <div>
      <h1 className="license__heading">{t('license.heading')}</h1>
      <p className="c-licensebox__introduction license__introduction">
        {t('license.introduction')}
      </p>
      <Tabs tabs={tabs} />
    </div>
  );
};

LicenseBox.propTypes = {
  license: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  article: ArticleShape.isRequired,
};

export default injectT(LicenseBox);
