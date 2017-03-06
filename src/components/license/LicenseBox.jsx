/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import defined from 'defined';
import Tabs from 'ndla-tabs';
import { injectT } from '../../i18n';
import ImageLicenseList from './ImageLicenseList';
import AudioLicenseList from './AudioLicenseList';
import ArticleLicenseInfo from './ArticleLicenseInfo';
import Citation from './Citation';
import TextDownloadList from './TextDownloadList';
import { ArticleShape } from '../../shapes';


function buildLicenseTabList(article, license, locale, t) {
  const images = defined(article.contentCopyrights.image, []);
  const audios = defined(article.contentCopyrights.audio, []);

  const tabs = [];

  if (images.length > 0) {
    tabs.push({ title: t('license.tabs.images'), content: <ImageLicenseList images={images} heading={t('license.images.heading')} description={t('license.images.description')} locale={locale} /> });
  }

  if (article) {
    tabs.push({ title: t('license.tabs.article'), content: (<ArticleLicenseInfo article={article} license={license} />) });
  }

  if (audios.length > 0) {
    tabs.push({ title: t('license.tabs.audios'), content: <AudioLicenseList audios={audios} heading={t('license.heading')} locale={locale} /> });
  }

  tabs.push({ title: t('license.tabs.text'), content: <TextDownloadList /> });
  tabs.push({ title: t('license.tabs.cite'), content: <Citation article={article} /> });

  return tabs;
}


const LicenseBox = ({ article, license, locale, t }) => {
  const contentType = article.contentType.toLowerCase();
  const tabs = buildLicenseTabList(article, license, locale, t);
  return (
    <div className="">
      <h1 className="license__heading">{t('license.tabs.heading', { contentType })}</h1>
      <p className="license__introduction">{t('license.tabs.introduction', { contentType })}</p>
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
