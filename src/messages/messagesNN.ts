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
    subjectsPage: `Alle fag - ${titleTemplate}`,
    searchPage: `Søk - ${titleTemplate}`,
    notFound: `Sida finst ikkje - ${titleTemplate}`,
    accessDenied: `Ingen tilgang - ${titleTemplate}`,
    subject: 'Fag',
    podcast: `Podkast - Side {{page}} - ${titleTemplate}`,
    lti: `LTI - ${titleTemplate}`,
    movedResourcePage: `Sida har flytta - ${titleTemplate}`,
    myNdlaPage: `Min NDLA - ${titleTemplate}`,
    myFoldersPage: `Mine mapper - ${titleTemplate}`,
    myFolderPage: `{{folderName}} - ${titleTemplate}`,
    myTagPage: `#{{tag}} - ${titleTemplate}`,
    myTagsPage: `Mine emneknagger - ${titleTemplate}`,
    sharedFolderPage: `{{name}} - ${titleTemplate}`,
    aboutPage: `{{name}} - ${titleTemplate}`,
  },
  footer: {
    cookiesLink: 'Erklæring for informasjonskapslar',
  },
  programmes: {
    header: 'Kva vil du lære om i dag?',
    description: 'Vel utdanningsprogram for å sjå faga dine',
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
  myndla: {
    campaignBlock: {
      title: 'Prøv praterobotane våre',
      linkText: 'Prøv NDLAs praterobotar',
      ingressStudent:
        'Lurer du på noko i faget ditt? Vil du ha hjelp til å forenkle ein tekst, øve til ein prøve eller få forslag til ein disposisjon? Prøv prateroboten vår og sjå om han kan hjelpe deg! I periodar med eksamensgjennomføring kan det hende fylkeskommunen stenger tilgangen til praterobotane.',
      ingress:
        'Vil du bruke KI i undervisninga? NDLA har laga to praterobotar som tek vare på personvernet ditt og trygt kan brukast til jobb og i undervisning. I periodar med eksamensgjennomføring kan det hende fylkeskommunen stenger tilgangen til praterobotane.',
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
  lti: {
    goBack: 'Tilbake til LTI-søk',
  },
  resourcepageTitles: {
    video: 'Video',
    image: 'Bilde',
    concept: 'Forklaring',
    audio: 'Audio',
  },

  arena: {
    header: 'Arena',
    description:
      'Velkommen til NDLAs Arena. Her kan du diskutere, dele og samarbeide med andre lærarar frå heile Noreg.',
    title: 'Kategoriar',
    category: {
      posts: 'Innlegg',
      newPost: 'Nytt innlegg',
    },
    topic: {
      responses: 'Svar',
    },
    bottomText:
      'Saknar du ein kategori? Du kan be om nye kategoriar. Bruk "Spør NDLA" eller send ein epost til moderator@ndla.no',
  },
};

export default messages;
