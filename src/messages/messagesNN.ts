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
    welcomePage: `Framsida - ${titleTemplate}`,
    topicPage: 'Emne',
    subjectsPage: `Velg fag - ${titleTemplate}`,
    searchPage: `Søk - ${titleTemplate}`,
    notFound: `Sida finst ikkje - ${titleTemplate}`,
    accessDenied: `Ingen tilgang - ${titleTemplate}`,
    subject: 'Fag',
    lti: `LTI - ${titleTemplate}`,
    movedResourcePage: `Sida har flytta - ${titleTemplate}`,
    toolbox: {
      visualElement: 'Om emne video',
      introduction:
        'Kva vil det seie å arbeide utforskande? Korleis kan du lære betre? Kva skal til for å få gruppearbeid til å fungere? I Verktøykassa finn både elevar og lærerar ressursar som er aktuelle for alle fag, og som støtter opp under læringsarbeid og utvikling av kunnskap, ferdigheter og forståing.',
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
      license: 'CC-BY-NC-SA-4.0',
      licenseAuthor: 'Scanpix.no',
    },
  },
};

export default messages;
