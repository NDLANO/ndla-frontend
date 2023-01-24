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
    subjectsPage: `Alle fag - ${titleTemplate}`,
    searchPage: `Søk - ${titleTemplate}`,
    notFound: `Siden finnes ikke - ${titleTemplate}`,
    accessDenied: `Ingen tilgang - ${titleTemplate}`,
    subject: 'Fag',
    podcast: `Podkast - Side {{pageNumber}} - ${titleTemplate}`,
    lti: `LTI - ${titleTemplate}`,
    movedResourcePage: `Siden har flyttet - ${titleTemplate}`,
    myNdlaPage: `Min NDLA - ${titleTemplate}`,
    myFoldersPage: `Mine mapper - ${titleTemplate}`,
    myFolderPage: `{{folderName}} - ${titleTemplate}`,
    myTagPage: `#{{tag}} - ${titleTemplate}`,
    myTagsPage: `Mine tags - ${titleTemplate}`,
    toolbox: {
      visualElement: 'Om emne video',
      introduction:
        'Hva vil det si å arbeide utforskende? Hvordan kan du lære bedre? Hva skal til for å få gruppearbeid til å fungere? I Verktøykassa finner både elever og lærere ressurser som er aktuelle for alle fag, og som støtter opp under læringsarbeid og utvikling av kunnskap, ferdigheter og forståelse.',
    },
  },
  podcastPage: {
    episodes: 'Episoder',
    podcast: 'Podkast',
    podcasts: 'Podkaster',
    pageInfo: 'Side {{page}} av {{lastPage}}',
    noResults: '...Ingen episoder',
  },
  messageBoxInfo: {
    subjectBeta:
      'Dette faget er i betaversjon. Vi fyller på med ressurser fortløpende.',
  },
  blogPosts: {
    blog1: {
      imageUrl: '/static/nye-fag.jpg',
      text: 'Forslag til årsplaner fra NDLA',
      externalLink:
        'https://blogg.ndla.no/2021/08/forslag-til-arsplaner-hos-ndla/',
      linkText: 'Fagblogg',
      license: 'CC-BY-SA-4.0',
      licenseAuthor: 'Vibeke Klungland',
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
      name: 'Navn',
    },
    required: 'Dette feltet er påkrevd',
    requiredField: '$t(validation.fields.{{field}}) er påkrevd',
    notUnique: 'Finnes allerede',
    maxLength: 'Dette feltet kan maks inneholde {{count}} tegn',
    maxLengthField:
      '$t(validation.fields.{{field}}) kan maks innholde {{count}} tegn',
  },
  resourcepageTitles: {
    video: 'Video',
    image: 'Bilde',
    audio: 'Audio',
    concept: 'Forklaring',
  },
};

export default messages;
