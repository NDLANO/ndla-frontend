/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 * FRI OG BEGRENSET
 */

import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import LicenseByline from './LicenseByline';


class LicenseBox extends Component {
  constructor() {
    super();
    this.state = {
      licenseAction: 'hidden',
    };
    this.licenseActionHandler = this.licenseActionHandler.bind(this);
  }
  licenseActionHandler(e) {
    const { action } = e.target.dataset;
    this.setState({
      licenseAction: action,
    });
  }

  render() {
    const { article, licenseType } = this.props;
    const uri = licenseType.replace(/-/g, '');
    const uriMap = (uri) => {
      switch (uri) {
        case 'byncnd' : return { short: 'Begrenset', heading: 'Navngivelse-IkkeKommersiell-IngenBearbeidelser', img: [ require('./icons/by.svg'), require('./icons/nc.svg'), require('./icons/nd.svg')
        ], body: `Denne lisensen er den mest restriktive av våre seks kjernelisenser. Den tillater andre å laste ned ditt verk og dele dem med andre så lenge du er navngitt som opphavspersonen, men de kan ikke endre dem på noen måte, eller bruke dem kommersielt.` }
        case 'byncsa' : return { short: 'Begrenset', heading: 'Navngivelse-IkkeKommersiell-DelPåSammeVilkår', img: [require('./icons/by.svg'), require('./icons/nc.svg'), require('./icons/sa.svg')], body: `Denne lisensen lar andre distribuere, endre, remixe, og bygge videre på ditt verk for ikke-kommersielle formål. Deres verk må navngi deg som den opprinnelige opphavspersonen og avledete verk må bære en tilsvarende lisens.` }
        case 'bync' : return { short: 'Fritt', heading: `Navngivelse-IkkeKommersiell`, img: [require('./icons/by.svg'), require('./icons/nc.svg')], body: `Denne lisensen lar andre distribuere, endre, remixe, og bygge videre på ditt verk for ikke-kommersielle formål. Deres verk må navngi deg som opphavsperson og også være ikke-kommersielle, men de behøver ikke kreve at verk avledet fra deres bærer de samme vilkårene.` }
        case 'bynd' : return { short: 'Fritt', heading: 'Navngivelse-IngenBearbeidelse', img: [require('./icons/by.svg'),require('./icons/nd.svg')], body: `Denne lisensen gir mulighet for å videredistribuere verket, både for kommersielle og for ikke-kommersielle formål, så lenge det gis videre uendret og sin helhet, og at du navngis som den som har skapt verket.` }
        case 'bysa' : return { short: 'Fritt', heading: 'Navngivelse-DelPåSammeVilkår', img: [require('./icons/by.svg'), require('./icons/sa.svg')], body: `Denne lisensen lar andre distribuere, endre, remixe, og bygge videre på ditt verk, også for kommersielle formål, så lenge de navngir deg som den opprinnelige opphavspersonen og avledete verk må bære en tilsvarende lisens. Denne lisensen blir ofte sidestilt med "copyleft" og åpen kildekode-lisenser. Alle nye verk basert på ditt vil være utstyrt ned den samme lisensen, slik at eventuelle avledete verk vil også tillate kommersiell bruk. Dette er den lisensen som brukes av Wikipedia, og som anbefales for materiale som ville ha nytte av å kunne inkludere innhold fra Wikipedia og fra andre prosjekter med tilsvarende lisenser.` };
        default : return { heading: uri, img: '', body: uri };
      }
    };
    const citeMap = [
      {
        name: 'Harvard',
        format: '',
      },
      {
        name: 'Chicago',
        format: '',
      },
      {
        name: 'MLA',
        format: '',
      },
    ];
    const authors = article.copyright.authors.map(author => author.name).join(', ');
    const license = uriMap(uri);
    const { licenseAction } = this.state;
    const citeText = `${authors}. Norsk Digital Læringsarena.`;
    const citeBox = (<div>{citeText}</div>);
    const cite = (<div><ul className="license__list">
        {
          citeMap.map(style => <li className="license__list-item">{style.name}</li>)
        }
        </ul>
        {citeBox}
          </div>);
    const use = (<div><ul className="license__list">
              <li className="license__list-item"><ul className="license__list">Bilder:
                <li className="license__list-item"><img src="http://placehold.it/50x50" /><LicenseByline licenseType='by-sa' /></li>
                <li className="license__list-item"><img src="http://placehold.it/50x50" /><LicenseByline licenseType='by-nc' /></li>
                <li className="license__list-item"><img src="http://placehold.it/50x50" /><LicenseByline licenseType='by-sa' /></li>
              </ul>
              </li>
              <li className="license__list-item">Video: </li>
              <li className="license__list-item">Tekst: </li>
            </ul></div>);

    return (
      <div className="license">
        <div className="license-section">
          <ul className="license__list">{article.copyright.authors.length > 1 ? 'Opphavspersoner' : 'Opphavsperson'}:
            {
              article.copyright.authors.map((author, i) => (<li className="license__list-item" key={i}>{author.name} {author.type ? `(${author.type})` : ''}</li>))
            }
          </ul>
        </div>
        <h2>Bruk eller del {article.contentType.toLowerCase()}:</h2>
        <div className="license-section">
          <button className="license__action" onClick={this.licenseActionHandler} data-action="cite">Sitere</button>
          <button className="license__action" onClick={this.licenseActionHandler} data-action="use">Gjenbruke</button>
        </div>
        <div className="license-section">
        {
          licenseAction === 'cite' ? cite : ''
        }{
          licenseAction === 'use' ? use : ''
        }
      </div>
        <div className="license-section license__publication-info">
          Opprettet {article.created}. Sist oppdatert {moment(article.updated).format('DD.MM.YYYY')}
        </div>
        {license.body}
      </div>
    );
  };
};

LicenseBox.propTypes = {
  licenseType: PropTypes.string.isRequired,
  article: PropTypes.object,
};

export default LicenseBox;
