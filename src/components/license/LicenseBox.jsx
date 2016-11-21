/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, PropTypes } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import defined from 'defined';
import { injectT } from '../../i18n';
import ImageLicenseList from './ImageLicenseList';
import AudioLicenseList from './AudioLicenseList';
import ArticleLicenseInfo from './ArticleLicenseInfo';
import Citation from './Citation';

/* Disable default styles for tabs */
Tabs.setUseDefaultStyles(false);

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

  render() {
    const { article, license, locale, t } = this.props;

    const images = defined(article.contentCopyrights.image, []);
    const audios = defined(article.contentCopyrights.audio, []);

    return (
      <div>
        <h1 className="license__heading">{t('license.tabs.heading', { contentType: article.contentType.toLowerCase() })}</h1>
        <Tabs onSelect={this.licenseActionHandler} selectedIndex={this.state.licenseAction} >
          <TabList>
            {defined(article) && <Tab>{t('license.tabs.article')}</Tab>}
            {images.length > 0 && <Tab>{t('license.tabs.images')}</Tab>}
            {audios.length > 0 && <Tab>{t('license.tabs.audios')}</Tab>}
            <Tab>{t('license.tabs.text')}</Tab>
            <Tab>{t('license.tabs.cite')}</Tab>
          </TabList>
          { defined(article) &&
            <TabPanel>
              <ArticleLicenseInfo
                license={license}
                authors={article.copyright.authors}
                created={article.created}
                updated={article.updated}
              />
            </TabPanel>
          }
          { images.length > 0 &&
            <TabPanel>
              <ImageLicenseList images={images} heading={t('license.heading')} locale={locale} />
            </TabPanel>}
          { audios.length > 0 &&
            <TabPanel>
              <AudioLicenseList audios={audios} heading={t('license.heading')} locale={locale} />
            </TabPanel>
          }
          <TabPanel>{t('license.articleText')}
            <div>
              <textarea className="license__textarea" name="ArticleText" rows="20" defaultValue={article.content} />
            </div>
          </TabPanel>
          <TabPanel><Citation article={article} /></TabPanel>
        </Tabs>
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
