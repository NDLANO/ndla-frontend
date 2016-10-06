/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import classnames from 'classnames';

import { injectT } from '../../../i18n';
import cc from './icons/cc.svg';
import quote from './icons/quote.svg';
import copymachine from './icons/copymachine.svg';
import License from './License';

const Author = ({ author }) => (
  <span>{author.name}</span>
);

const license = (type = "") => {
  const uri = type.replace(/-/g, '');
  const uriMap = (uri) => {
    switch (uri) {
      case 'byncnd' : return { short: 'Begrenset', heading: 'Navngivelse-IkkeKommersiell-IngenBearbeidelser', img: [ require('./icons/by.svg'), require('./icons/nc.svg'), require('./icons/nd.svg')
      ], body: `Denne lisensen er den mest restriktive av våre seks kjernelisenser. Den tillater andre å laste ned ditt verk og dele dem med andre så lenge du er navngitt som opphavspersonen, men de kan ikke endre dem på noen måte, eller bruke dem kommersielt.` }
      case 'byncsa' : return { short: 'Begrenset', heading: 'Navngivelse-IkkeKommersiell-DelPåSammeVilkår', img: [require('./icons/by.svg'), require('./icons/nc.svg'), require('./icons/sa.svg')], body: `Denne lisensen lar andre distribuere, endre, remixe, og bygge videre på ditt verk for ikke-kommersielle formål. Deres verk må navngi deg som den opprinnelige opphavspersonen og avledete verk må bære en tilsvarende lisens.` }
      case 'bync' : return { short: 'Fritt', heading: `Navngivelse-IkkeKommersiell`, img: [require('./icons/by.svg'), require('./icons/nc.svg')], body: `Denne lisensen lar andre distribuere, endre, remixe, og bygge videre på ditt verk for ikke-kommersielle formål. Deres verk må navngi deg som opphavsperson og også være ikke-kommersielle, men de behøver ikke kreve at verk avledet fra deres bærer de samme vilkårene.` }
      case 'bynd' : return { short: 'Fritt', heading: 'Navngivelse-IngenBearbeidelse', img: [require('./icons/by.svg'),require('./icons/nd.svg')], body: `Denne lisensen gir mulighet for å videredistribuere verket, både for kommersielle og for ikke-kommersielle formål, så lenge det gis videre uendret og sin helhet, og at du navngis som den som har skapt verket.` }
      case 'bysa' : return { short: 'Fritt', heading: 'Navngivelse-DelPåSammeVilkår', img: [require('./icons/by.svg'), require('./icons/sa.svg')], body: `Denne lisensen lar andre distribuere, endre, remixe, og bygge videre på ditt verk, også for kommersielle formål, så lenge de navngir deg som den opprinnelige opphavspersonen og avledete verk må bære en tilsvarende lisens. Denne lisensen blir ofte sidestilt med "copyleft" og åpen kildekode-lisenser. Alle nye verk basert på ditt vil være utstyrt ned den samme lisensen, slik at eventuelle avledete verk vil også tillate kommersiell bruk. Dette er den lisensen som brukes av Wikipedia, og som anbefales for materiale som ville ha nytte av å kunne inkludere innhold fra Wikipedia og fra andre prosjekter med tilsvarende lisenser.` };
      default : return { heading: type, img: '', body: type };
    }
  };
  const license = uriMap(uri);

  return (
    <div>
      <h3>{license.heading}</h3>
      <p>{license.body}</p>

      <img src={cc} /> {license.img.map((uri, i) => (<span><img key={i} className="license__icons" src={uri} />{license.short}</span>))}
    </div>
  );
};

Author.propTypes = {
  author: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};

class Article extends Component {
  constructor() {
    super();
    this.state = {
      hideLicense: true,
    };
  }
  licenseHandler() {
    this.setState({ hideLicense: !this.state.hideLicense });
  }
  render() {
    const { article, t } = this.props;
    const authors = article.copyright.authors.map(author => author.name).join(', ');
    const licenseClass = classnames({
      "license": true,
      "u-hide": this.state.hideLicense,
    });
    return (
      <article className="article">
        <h1>{article.title}</h1>
        <div><span className="article_meta">{authors}. {t('article.published')}: {article.created}</span>.</div>
        <a onClick={this.licenseHandler.bind(this)}>Sitér eller bruk denne {article.contentType.toLowerCase()}</a>
          <License licenseType={article.copyright.license.license} />
        <div className={licenseClass}>
          <div className="license-section">
            <ul className="license__list">{article.copyright.authors.length > 1 ? `Opphavspersoner` : `Opphavsperson`}:
              {
                article.copyright.authors.map((author, i) => (<li className="license__list-item" key={i}>{author.name} {author.type ? `(${author.type})`:''}</li>))
              }
            </ul>
          </div>
          <div className="license-section license__action">
            <ul className="license__list">Bruk eller del {article.contentType.toLowerCase()}:
              <li className="license__list-item">
                <ul className="license__list"><a href="#"><img role="presentation" src={quote} />Sitere</a>
                  <li className="license__list-item">Harvard</li>
                  <li className="license__list-item">MLA</li>
                  <li className="license__list-item">Chicago</li>
                </ul>
              </li>
              <li className="license__list-item">
                <ul className="license__list"><a href="#"><img role="presentation" src={copymachine} />Gjenbruke</a>
                  <li className="license__list-item"><ul className="license__list">Bilder:
                    <li className="license__list-item">Bilde 1</li>
                    <li className="license__list-item">Bilde 2</li>
                    <li className="license__list-item">Bilde 3</li>
                  </ul>
                  </li>
                  <li className="license__list-item">Video: </li>
                  <li className="license__list-item">Tekst: </li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="license-section license__publication-info">
            Opprettet {article.created}. Sist oppdatert {moment(article.updated).format('DD.MM.YYYY')}
          </div>
          {license(article.copyright.license.license)}
        </div>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>
    );
  }
}

Article.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    copyright: PropTypes.shape({
      authors: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
};


export default injectT(Article);
