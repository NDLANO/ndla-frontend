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
    welcomePage: `Ovdasiidu - ${titleTemplate}`,
    topicPage: 'Fáddá',
    subjectsPage: `Vállje fága - ${titleTemplate}`,
    searchPage: `Oza - ${titleTemplate}`,
    notFound: `Siidu ii gávdno - ${titleTemplate}`,
    accessDenied: `Ingen tilgang - ${titleTemplate}`,
    subject: 'Fága',
    podcast: `Podkast - Side {{pageNumber}} - ${titleTemplate}`,
    lti: `LTI - ${titleTemplate}`,
    movedResourcePage: `Siidu lea sirdojuvvon - ${titleTemplate}`,
    myNdlaPage: `Mu NDLA - ${titleTemplate}`,
    myFoldersPage: `Mu máhpat - ${titleTemplate}`,
    myFolderPage: `{{folderName}} - ${titleTemplate}`,
    myTagPage: `#{{tag}} - ${titleTemplate}`,
    myTagsPage: `Mu lihput - ${titleTemplate}`,
    aboutPage: `{{name}} - ${titleTemplate}`,
  },
  podcastPage: {
    episodes: 'Episoder',
    podcast: 'Podkast',
    podcasts: 'Podkaster',
    pageInfo: 'Side {{page}} av {{lastPage}}',
    noResults: '...Ingen episoder',
  },
  sharedFolder: 'Delt mappe',
  campaignBlock: {
    title: 'Planlegg skuleåret med NDLA',
    linkText: 'Sjå forslag',
    ingress:
      'Sjå våre forslag til aktivitetar og årsplanar. Gode resultat startar med god planlegging.',
  },
  blogPosts: {
    blog1: {
      imageUrl: '/static/samiske-laeremidler.jpg',
      text: 'Utvikler samiske ressurser på NDLA',
      externalLink:
        'https://blogg.ndla.no/2023/02/utvikler-samiske-ressurser-pa-ndla/',
      linkText: 'Fagblogg',
      license: 'CC-BY-SA-4.0',
      licenseAuthor: 'Jan Frode Lindsø',
    },
    blog2: {
      imageUrl: '/static/aktiviser-elevene.jpg',
      text: 'Huskeliste for kontaktlærere',
      externalLink:
        'https://blogg.ndla.no/2019/08/huskeliste-for-kontaktlaerere/',
      linkText: 'Fagblogg',
      license: 'CC-BY-SA-4.0',
      licenseAuthor: 'Tom Knudsen',
    },
  },
  validation: {
    fields: {
      name: 'Namn',
      description: 'Beskrivelse',
    },
    required: 'Dette feltet er påkrevd',
    requiredField: '$t(validation.fields.{{field}}) er påkrevd',
    notUnique: 'Finnes allereie',
    maxLength: 'Dette feltet kan maks innehalde {{count}} teikn',
    maxLengthField:
      '$t(validation.fields.{{field}}) kan maks innehalde {{count}} teikn',
  },
  resourcepageTitles: {
    video: 'Video',
    image: 'Bilde',
    concept: 'Forklaring',
    audio: 'Audio',
  },
};

export default messages;
