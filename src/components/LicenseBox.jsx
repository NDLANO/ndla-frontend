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
import getLicenseByKey from './licenseConstants';
import { injectT } from '../i18n';
import LicenseByline from './LicenseByline';
import Citation from './Citation';
import formatDate from '../util/formatDate';

const ImageLicenseInfo = ({ image }) => (
  <li className="license__list-item">
    <img alt={image.altText} src={image.src} />
    <LicenseByline licenseType="by-nc" />Av Navn
  </li>
);

ImageLicenseInfo.propTypes = {
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    copyright: PropTypes.shape({

    }),
  }),
};

const ImageLicenseList = ({ images, t }) => (
  <div>
    <h2>{t('license.heading')}</h2>
    <ul className="license__list">
      <li className="license__list-item">
        <ul className="license__list">
          { images.map((image, index) => <ImageLicenseInfo image={image} key={index} />) }
        </ul>
      </li>
    </ul>
  </div>
);

ImageLicenseList.propTypes = {
  images: PropTypes.array.isRequired,
};

class LicenseBox extends Component {
  constructor() {
    super();
    this.licenseActionHandler = this.licenseActionHandler.bind(this);
    this.state = {
      licenseAction: 0,
      hideLicenseByline: false,
    };
  }

  licenseBoxHandler() {
    this.setState({
      hideLicenseByline: !this.state.hideLicenseByline,
    });
  }

  licenseActionHandler(index) {
    this.setState({
      licenseAction: index,
    });
  }

  render() {
    const { article, licenseType, locale, t } = this.props;
    const license = getLicenseByKey(licenseType, locale);

    const oembedH5p = document.createElement('div');
    oembedH5p.innerHTML = article.content;
    const h5ps = [].slice.apply(oembedH5p.querySelectorAll('iframe'));

    const oembedVideos = document.createElement('div');
    oembedVideos.innerHTML = article.content;
    const videos = [].slice.apply(oembedVideos.querySelectorAll('video'));

    const images = defined(article.contentCopyrights.image, []);

    if (this.state.hideLicenseByline) return false;
    return (
      <div>
        <h2>{license.heading}</h2>
        <p>{license.body}</p>
        <div className="license-section">
          <ul className="license__list">{article.copyright.authors.length > 1 ? 'Opphavspersoner' : 'Opphavsperson'}:
            {
              article.copyright.authors.map((author, i) => (<li className="license__list-item" key={i}>{author.name} {author.type ? `(${author.type})` : ''}</li>))
            }
          </ul>
        </div>
        <div className="license-section license__publication-info">
          Opprettet {formatDate(article.created)}. Sist oppdatert {formatDate(article.updated)}
        </div>
        <h2 className="license__heading">Sitere eller gjenbruk {article.contentType.toLowerCase()}:</h2>

        <Tabs
          onSelect={this.licenseActionHandler}
          selectedIndex={this.state.licenseAction}
        >
          <TabList>
            {images.length > 0 && <Tab>Bilder</Tab>}
            <Tab>Tekst</Tab>
            {h5ps.length > 0 && <Tab>Interaktivitet</Tab>}
            {videos.length > 0 && <Tab>Video</Tab>}
            <Tab>Sitere</Tab>
          </TabList>
          { images.length > 0 && <TabPanel><ImageLicenseList images={images} t={t} /></TabPanel>}
          <TabPanel>Artikkeltekst: Last ned som (word), (txt), (pdf)
            <div>
              <textarea className="license__textarea" name="ArticleText" rows="20" defaultValue={article.content} />
            </div>
          </TabPanel>
          {h5ps.length > 0 && <TabPanel>
            <ul className="license-section">
              {h5ps.map((h5p, index) => <li className="license__list-item" key={index}>
                <div dangerouslySetInnerHTML={{ __html: h5p.innerHTML }} />
                <LicenseByline licenseType="by-nc" />Av Navn</li>)}
            </ul>
          </TabPanel> }
          {videos.length > 0 && <TabPanel>Video</TabPanel>}
          <TabPanel><Citation article={article} /></TabPanel>
        </Tabs>
      </div>
    );
  }
}

LicenseBox.propTypes = {
  licenseType: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  article: PropTypes.object,
};

LicenseBox.defaultProps = {
  article: {
    copyright: {
      authors: [
        '',
      ],
    },
  },
  licenseType: '',
};

export default injectT(LicenseBox);
