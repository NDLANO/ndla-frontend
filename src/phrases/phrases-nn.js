/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const phrases = {
  articlePage: {
    errorDescription: 'Orsak, ein feil oppstod under lasting av ressursen.',
    error404Description:
      'Orsak, vi kunne ikkje finne ressursen du leiter etter.',
  },
  notFoundPage: {
    errorDescription: 'Orsak, vi fann ikkje sida du prøvde å kome til.',
  },
  searchPage: {
    noHits: 'Ingen artiklar samsvara med søket ditt på: {query}',
  },
  subjectPage: {
    errorDescription: 'Orsak, ein feil oppstod under lasting av emnene.',
    tabs: {
      topics: 'Emner',
    },
  },
  subjectsPage: {
    errorDescription: 'Orsak, ein feil oppstod under lasting av faga.',
    chooseSubject: 'Vel fag',
  },
  topicPage: {
    topicErrorDescription:
      'Orsak, ein feil oppstod under lasting av emneinnhaldet.',
    articleErrorDescription:
      'Orsak, ein feil oppstod under lasting av emneskildringa.',
    topic: 'EMNE',
    topics: 'Emner',
  },
  welcomePage: {
    subjects: 'Fag',
    search: 'Gå til søk',
    errorDescription: 'Orsak, ein feil oppstod under lasting av faga.',
  },
  meta: {
    description:
      'Kvalitetssikra fritt tilgjengelege nettbaserte læremiddel for videregåande opplæring',
  },
  masthead: {
    menu: {
      close: 'Lukk',
      goTo: 'Gå til',
      search: 'Søk',
      subjectOverview: 'Fagoversikt',
      title: 'Meny',
      subjectPage: 'Fagforside',
      learningResourcesHeading: 'Læringsressurser',
      back: 'Tilbake',
      contentTypeResultsShowMore: 'Vis mer',
    },
  },
  logo: {
    altText: 'Nasjonal digital læringsarena',
  },
  resource: {
    errorDescription: 'Orsak, ein feil oppstod under lasting av emneressursar.',
    noCoreResourcesAvailable: 'Det er ikkje noko kjernestoff tilgjengeleg.',
    activateAdditionalResources: 'Vis tilleggsstoff',
    toggleFilterLabel: 'Tilleggsstoff',
    showLess: 'Vis mindre',
    showMore: 'Vis meir',
  },
  searchForm: {
    placeholder: 'Søk etter artiklar',
    btn: 'Søk',
    order: {
      relevance: 'Relevans',
      title: 'Alfabetisk',
    },
  },
  article: {
    lastUpdated: 'Sist oppdatert',
    edition: 'Utgåve',
    publisher: 'Utgjevar',
    closeLicenseBox: 'Lukk boks',
    openLicenseBox: 'Bruk artikkel',
  },
  subject: {
    associatedTopics: 'Tilhørende emner',
  },
  license: {
    heading: 'Slik gjenbruker du innhald',
    learnMore: 'Lær meir om opne lisensar',
    copyTitle: 'Kopier referanse',
    hasCopiedTitle: 'Kopiert!',
    embed: 'Bygg inn',
    embedCopied: 'Kopierte innbyggingskode!',
    download: 'Last ned',
    tabs: {
      text: 'Tekst',
      images: 'Bilde',
      audio: 'Lyd',
      video: 'Video',
    },
    images: {
      heading: 'Slik bruker du bilder frå artikkelen',
      description:
        'Hugs å kopiera teksten som skal leggjast ved bildet der du bruker det.',
      rules: 'Regler for bruk av bildet:',
      source: 'Kjelde',
      title: 'Tittel',
    },
    text: {
      heading: 'Slik bruker du tekst frå artikkelen',
      description:
        'Artikkelen kan vera samansett av fleire ulike tekstar som vert lista her.',
      rules: 'Reglar for bruk av teksten:',
      published: 'Publiseringsdato',
    },
    audio: {
      heading: 'Slik bruker du lydfiler',
      description:
        'Hugs å kopiera teksten som skal leggjast ved lydfila der du bruker ho.',
      rules: 'Regler for bruk av lydfila:',
    },
    video: {
      heading: 'Slik bruker du video fra artikkelen',
      description:
        'Hugs å kopiera teksten som skal leggjast ved videoen der du bruker han.',
      rules: 'Regler for bruk av videoen:',
    },
    creditType: {
      originator: 'Opphavsmann',
      photographer: 'Fotograf',
      artist: 'Kunstnar',
      editorial: 'Redaksjonelt',
      writer: 'Forfattar',
      scriptwriter: 'Manusforfattar',
      reader: 'Innlesar',
      translator: 'Omsetjar',
      director: 'Regissør',
      illustrator: 'Illustratør',
      cowriter: 'Medforfatter',
      composer: 'Komponist',
      processor: 'Tilarbeidar',
      facilitator: 'Tilretteleggjar',
      linguistic: 'Språkleg',
      idea: 'Idé',
      compiler: 'Sammenstillar',
      correction: 'Korrektur',
      rightsholder: 'Rettshaver',
      publisher: 'Forlag',
      distributor: 'Distributør',
      supplier: 'Leverandør',
    },
  },
  errorMessage: {
    title: 'Ops, noko gjekk gale',
    description: 'Orsak, ein feil oppstod.',
    back: 'Tilbake',
    goToFrontPage: 'Gå til forsida',
  },
  footer: {
    aboutNDLA: 'Om NDLA',
    selectLanguage: 'Vel språk (language): ',
    footerInfo: 'Nettstaden er utarbeida av NDLA med open kjeldekode.',
    footerEditiorInChief: 'Ansvarleg redaktør: ',
    footerManagingEditor: 'Utgåveansvarleg: ',
  },
};

export default phrases;
