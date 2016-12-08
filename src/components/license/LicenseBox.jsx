/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, PropTypes } from 'react';
import defined from 'defined';
import { injectT } from '../../i18n';
import ImageLicenseList from './ImageLicenseList';
import AudioLicenseList from './AudioLicenseList';
import ArticleLicenseInfo from './ArticleLicenseInfo';
import Citation from './Citation';
import Tabs from './Tabs';


class LicenseBox extends Component {
  constructor() {
    super();
    this.licenseActionHandler = this.licenseActionHandler.bind(this);
    this.state = {
      licenseAction: 0,
    };
  }

  licenseActionHandler(index) {
    this.setState({
      licenseAction: index,
    });
  }

  buildLicenseTabList() {
    const { article, license, locale, t } = this.props;

    const images = defined(article.contentCopyrights.image, []);
    const audios = defined(article.contentCopyrights.audio, []);

    const tabs = [];

    if (images.length > 0) {
      tabs.push({ key: 'images', displayName: t('license.tabs.images'), content: <ImageLicenseList images={images} heading={t('license.heading')} locale={locale} /> });
    }

    if (article) {
      tabs.push({
        key: 'article',
        displayName: t('license.tabs.article'),
        content: (
          <ArticleLicenseInfo
            icons={this.props.children}
            license={license}
            title={article.title}
            authors={article.copyright.authors}
            created={article.created}
            updated={article.updated}
          />
        ),
      });
    }

    if (audios.length > 0) {
      tabs.push({
        key: 'audios',
        displayName: t('license.tabs.audios'),
        content: <AudioLicenseList audios={audios} heading={t('license.heading')} locale={locale} />,
      });
    }

    tabs.push({
      key: 'text',
      displayName: t('license.tabs.text'),
      content: (
        <div>
          <ul className="c-downloadable-list">
            <li className="c-downloadable-list__item"><a href={document.location.href}>Last ned som word-dokument (.docx)</a></li>
            <li className="c-downloadable-list__item"><a href={document.location.href}>Last ned som rentekst (.txt)</a></li>
            <li className="c-downloadable-list__item"><a href={document.location.href}>Last ned som HTML</a></li>
          </ul>
        </div>
        ),
    });

    tabs.push({ key: 'cite', displayName: t('license.tabs.cite'), content: <Citation article={article} /> });
    return tabs;
  }

  render() {
    const { article, t } = this.props;

    const contentType = article.contentType.toLowerCase();
    const tabs = this.buildLicenseTabList();
    return (
      <div>
        <h1 className="license__heading">{t('license.tabs.heading', { contentType })}</h1>
        <p className="license__introduction">{t('license.tabs.introduction', { contentType })}</p>
        <Tabs tabs={tabs} />
      </div>
    );
  }
}

LicenseBox.propTypes = {
  license: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  article: PropTypes.object,
};


export default injectT(LicenseBox);
