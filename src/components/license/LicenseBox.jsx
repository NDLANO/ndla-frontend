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
        <ArticleLicenseInfo
          license={license}
          authors={article.copyright.authors}
          created={article.created}
          updated={article.updated}
        />

        <h2 className="license__heading">Sitere eller gjenbruk {article.contentType.toLowerCase()}:</h2>

        <Tabs onSelect={this.licenseActionHandler} selectedIndex={this.state.licenseAction} >
          <TabList>
            {images.length > 0 && <Tab>Bilder</Tab>}
            {audios.length > 0 && <Tab>Lydfiler</Tab>}
            <Tab>Tekst</Tab>
            <Tab>Sitere</Tab>
          </TabList>
          { images.length > 0 &&
            <TabPanel>
              <ImageLicenseList images={images} heading={t('license.heading')} locale={locale} />
            </TabPanel>}
          { audios.length > 0 &&
            <TabPanel>
              <AudioLicenseList audios={audios} heading={t('license.heading')} locale={locale} />
            </TabPanel>
          }
          <TabPanel>Artikkeltekst: Last ned som (word), (txt), (pdf)
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
  license: PropTypes.shape({
    heading: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  article: PropTypes.object,
};


export default injectT(LicenseBox);
