/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 * FRI OG BEGRENSET
 */

import React, { Component, PropTypes } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { injectT } from '../i18n';
import LicenseByline from './LicenseByline';
import Citation from './Citation';
import Icon from './icons/Icons';
import formatDate from '../util/formatDate';

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
    const { article, licenseType, t } = this.props;
    const licenseMap = (licenseId) => {
      const licenseKey = licenseId.replace(/-/g, '');
      switch (licenseKey) {
        case 'byncnd' : return {
          short: t('license.restrictedUse'),
          heading: 'Navngivelse-IkkeKommersiell-IngenBearbeidelser',
          img: [<Icon.LicenseBy />, <Icon.LicenseNc />, <Icon.LicenseNd />],
          body: `Denne lisensen er den mest restriktive av våre seks kjernelisenser.
          Den tillater andre å laste ned ditt verk og dele dem med andre så lenge du er navngitt som opphavspersonen, men de kan ikke endre dem på noen måte, eller bruke dem kommersielt.` };
        case 'byncsa' : return {
          short: t('license.restrictedUse'),
          heading: 'Navngivelse-IkkeKommersiell-DelPåSammeVilkår',
          img: [<Icon.LicenseBy />, <Icon.LicenseNc />, <Icon.LicenseSa />],
          body: `Denne lisensen lar andre distribuere, endre, remixe, og bygge videre på ditt verk for ikke-kommersielle formål.
          Deres verk må navngi deg som den opprinnelige opphavspersonen og avledete verk må bære en tilsvarende lisens.` };
        case 'bync' : return {
          short: t('license.usePhrase.freeUse'),
          heading: 'Navngivelse-IkkeKommersiell',
          img: [<Icon.LicenseBy />, <Icon.LicenseNc />],
          body: `Denne lisensen lar andre distribuere, endre, remixe, og bygge videre på ditt verk for ikke-kommersielle formål.
          Deres verk må navngi deg som opphavsperson og også være ikke-kommersielle, men de behøver ikke kreve at verk avledet fra deres bærer de samme vilkårene.` };
        case 'bynd' : return {
          short: t('license.usePhrase.freeUse'),
          heading: 'Navngivelse-IngenBearbeidelse',
          img: [<Icon.LicenseBy />, <Icon.LicenseNd />],
          body: `Denne lisensen gir mulighet for å videredistribuere verket,
          både for kommersielle og for ikke-kommersielle formål, så lenge det gis videre uendret og sin helhet, og at du navngis som den som har skapt verket.` };
        case 'bysa' : return {
          short: t('license.usePhrase.freeUse'),
          heading: 'Navngivelse-DelPåSammeVilkår',
          img: [<Icon.LicenseBy />, <Icon.LicenseSa />],
          body: `Denne lisensen lar andre distribuere, endre, remixe, og bygge videre på ditt verk, også for kommersielle formål,
          så lenge de navngir deg som den opprinnelige opphavspersonen og avledete verk må bære en tilsvarende lisens.
          Denne lisensen blir ofte sidestilt med "copyleft" og åpen kildekode-lisenser. Alle nye verk basert på ditt vil være utstyrt ned den samme lisensen,
          slik at eventuelle avledete verk vil også tillate kommersiell bruk.
          Dette er den lisensen som brukes av Wikipedia, og som anbefales for materiale som ville ha
          nytte av å kunne inkludere innhold fra Wikipedia og fra andre prosjekter med tilsvarende lisenser.` };
        default : return {
          heading: licenseKey,
          img: [''],
          body: licenseKey };
      }
    };
    const license = licenseMap(licenseType);

    const use = (<div>
      <h2>Du kan laste ned, eller innbygge innhold fra NDLA på ditt eget nettsted</h2>
      <ul className="license__list">
        <li className="license__list-item">
          <ul className="license__list">Bilder:
            <li className="license__list-item">
              <img role="presentation" src="http://placehold.it/150x150" />
              <LicenseByline licenseType="by-sa" />Av Navn
            </li>
            <li className="license__list-item">
              <img role="presentation" src="http://placehold.it/150x150" />
              <LicenseByline licenseType="by-nc" />Av Navn
            </li>
            <li className="license__list-item">
              <img role="presentation" src="http://placehold.it/150x150" />
              <LicenseByline licenseType="by-nc" />Av Navn
            </li>
          </ul>
        </li>
      </ul></div>);

    return (
      <div className="license">
        <div className="license-section license__publication-info">
          Opprettet {article.created}. Sist oppdatert {article.updated}
        </div>
        <p>{license.body}</p>
        <div className="license-section">
          <ul className="license__list">{article.copyright.authors.length > 1 ? 'Opphavspersoner' : 'Opphavsperson'}:
            {
              article.copyright.authors.map((author, i) => (<li className="license__list-item" key={i}>{author.name} {author.type ? `(${author.type})` : ''}</li>))
            }
          </ul>
        </div>
        <h2>Referer eller gjenbruk {article.contentType.toLowerCase()}:</h2>

        <Tabs
          onSelect={this.licenseActionHandler}
          selectedIndex={this.state.licenseAction}
        >
          <TabList>
            <Tab>Referansestiler</Tab>
            <Tab>Tekst</Tab>
            <Tab>Bilder</Tab>
            <Tab>Video</Tab>
          </TabList>
          <TabPanel><Citation article={article} /></TabPanel>
          <TabPanel>Artikkeltekst: Last ned som (word), (txt), (pdf)</TabPanel>
          <TabPanel>{use}</TabPanel>
          <TabPanel>Video</TabPanel>
        </Tabs>

        {/* <div className="license-section">
          <button className="license__action" onClick={this.licenseActionHandler} data-action="cite">Referer til dette innholdet</button>
          <button className="license__action" onClick={this.licenseActionHandler} data-action="use">Gjenbruk noe på denne siden</button>
        </div>
        <div className="license-section">
        {
          licenseAction === 'cite' ? <Citation article={article} /> : ''
        }{
          licenseAction === 'use' ? use : ''
        }
      </div>*/}
      </div>
    );
  }
}

LicenseBox.propTypes = {
  licenseType: PropTypes.string.isRequired,
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
