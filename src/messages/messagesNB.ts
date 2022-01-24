/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const titleTemplate = 'NDLA';

const messages = {
  htmlTitles: {
    titleTemplate,
    welcomePage: `Forsiden - ${titleTemplate}`,
    topicPage: 'Emne',
    subjectsPage: `Velg fag - ${titleTemplate}`,
    searchPage: `Søk - ${titleTemplate}`,
    notFound: `Siden finnes ikke - ${titleTemplate}`,
    accessDenied: `Ingen tilgang - ${titleTemplate}`,
    subject: 'Fag',
    podcast: `Podcast - Side {{pageNumber}} - ${titleTemplate}`,
    lti: `LTI - ${titleTemplate}`,
    movedResourcePage: `Siden har flyttet - ${titleTemplate}`,
    toolbox: {
      visualElement: 'Om emne video',
      introduction:
        'Hva vil det si å arbeide utforskende? Hvordan kan du lære bedre? Hva skal til for å få gruppearbeid til å fungere? I Verktøykassa finner både elever og lærere ressurser som er aktuelle for alle fag, og som støtter opp under læringsarbeid og utvikling av kunnskap, ferdigheter og forståelse.',
    },
  },
  blogPosts: {
    blog1: {
      imageUrl: '/static/nye-fag.jpg',
      text: 'Nye fag på NDLA',
      externalLink: 'https://blogg.ndla.no/2021/12/nye-fag-pa-ndla/',
      linkText: 'Fagblogg',
      license: 'CC-BY-SA-4.0',
      licenseAuthor: 'Vibeke Klungland',
    },
    blog2: {
      imageUrl: '/static/aktiviser-elevene.jpg',
      text: 'Aktiviser elevene med digitale verktøy',
      externalLink:
        'https://blogg.ndla.no/2021/09/aktiviser-elevane-med-digitale-verktoy/',
      linkText: 'Fagblogg',
      license: 'CC-BY-SA-4.0',
      licenseAuthor: 'Tom Knudsen',
    },
  },
};

export default messages;
