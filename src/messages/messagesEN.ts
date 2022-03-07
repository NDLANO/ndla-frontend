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
    welcomePage: `Frontpage - ${titleTemplate}`,
    topicPage: 'Topic',
    subjectsPage: `Choose subjects - ${titleTemplate}`,
    searchPage: `Search - ${titleTemplate}`,
    notFound: `Page not found - ${titleTemplate}`,
    accessDenied: `Access denied - ${titleTemplate}`,
    subject: 'Subject',
    podcast: `Podcast - Page {{page}} - ${titleTemplate}`,
    lti: `LTI - ${titleTemplate}`,
    movedResourcePage: `The page has been moved - ${titleTemplate}`,
    toolbox: {
      visualElement: 'About subject video',
      introduction:
        'What will it mean to work exploratory? How can you learn better? What is needed in order to make group work function? In the toolbox both students and teach find resources that are current for every subject, and that support learning work and development of knowledge, skills and understanding.',
    },
  },
  podcastPage: {
    episodes: 'Episodes',

    podcast: 'Podcast',
    podcasts: 'Podcasts',
    pageInfo: 'Page {{page}} of {{lastPage}}',
    noResults: '...No episodes',
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
      text: 'Aktiviser elevane med digitale verktøy',
      externalLink:
        'https://blogg.ndla.no/2021/09/aktiviser-elevane-med-digitale-verktoy/',
      linkText: 'Fagblogg',
      license: 'CC-BY-SA-4.0',
      licenseAuthor: 'Tom Knudsen',
    },
  },
};

export default messages;
