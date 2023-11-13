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
    podcast: `Podkast - Side {{page}} - ${titleTemplate}`,
    lti: `LTI - ${titleTemplate}`,
    movedResourcePage: `Siden har flyttet - ${titleTemplate}`,
    myNdlaPage: `Min NDLA - ${titleTemplate}`,
    myFoldersPage: `Mine mapper - ${titleTemplate}`,
    myFolderPage: `{{folderName}} - ${titleTemplate}`,
    myTagPage: `#{{tag}} - ${titleTemplate}`,
    myTagsPage: `Mine emneknagger - ${titleTemplate}`,
    sharedFolderPage: `{{name}} - ${titleTemplate}`,
    aboutPage: `{{name}} - ${titleTemplate}`,
  },
  footer: {
    cookiesLink: 'Erklæring for informasjonskapsler',
  },
  programmes: {
    header: 'Hva vil du lære om i dag?',
    description: 'Velg utdanningsprogram for å se dine fag',
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
    title: 'Planlegg skoleåret med NDLA',
    linkText: 'Se forslag',
    ingress:
      'Se våre forslag til aktiviteter og årsplaner. Gode resultater starter med god planlegging.',
  },
  myndla: {
    campaignBlock: {
      title: 'Prøv vår praterobot',
      linkText: 'Prøv NDLAs prateroboter',
      ingressStudent:
        'Lurer du på noe i faget ditt? Vil du ha hjelp til å forenkle en tekst, øve til en prøve eller få forslag til en disposisjon? Prøv prateroboten vår og se om den kan hjelpe deg!',
      ingress:
        'Vil du bruke AI i undervisninga? NDLA har laget to prateroboter som tar vare på personvernet ditt og trygt kan brukes til jobb og i undervisning.',
    },
  },
  validation: {
    fields: {
      name: 'Navn',
      description: 'Beskrivelse',
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

  arena: {
    header: 'Arena',
    description:
      'Velkommen til NDLAs Arena. Her kan du diskutere, dele og samarbeide med andre lærere fra hele Norge.',
    title: 'Kategorier',
    category: {
      posts: 'Innlegg',
      newPost: 'Nytt innlegg',
    },
    topic: {
      responses: 'Svar',
    },
    bottomText:
      'Savner du en kategori? Du kan be om nye kategorier. Bruk “Spør NDLA” eller send en epost til moderator@ndla.no',
  },
};

export default messages;
