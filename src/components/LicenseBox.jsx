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
import { injectT } from '../i18n';
import ImageLicenseList from './ImageLicenseList';
import Citation from './Citation';
import formatDate from '../util/formatDate';


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
            <Tab>Sitere</Tab>
          </TabList>
          { images.length > 0 && <TabPanel><ImageLicenseList images={images} t={t} locale={locale} /></TabPanel>}
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
