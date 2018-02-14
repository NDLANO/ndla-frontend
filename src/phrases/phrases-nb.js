/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const titleTemplate = ' - NDLA';

const phrases = {
  htmlTitles: {
    titleTemplate,
    welcomePage: `Forsiden${titleTemplate}`,
    topicPage: 'Emne',
    subjectsPage: `Velg fag${titleTemplate}`,
    searchPage: `Søk${titleTemplate}`,
    notFound: `Siden finnes ikke${titleTemplate}`,
  },
  articlePage: {
    errorDescription: 'Beklager, en feil oppsto under lasting av ressursen.',
    error404Description: 'Beklager, finner ikke ressursen du leter etter.',
  },
  notFoundPage: {
    errorDescription: 'Beklager, finner ikke siden du prøvde å komme til.',
  },
  searchPage: {
    noHits: 'Ingen artikler samsvarte med søket ditt på: {query}',
  },
  subjectPage: {
    errorDescription: 'Beklager, en feil oppsto under lasting av emnene.',
    tabs: {
      topics: 'Emner',
    },
  },
  subjectsPage: {
    errorDescription: 'Beklager, en feil oppsto under lasting av fagene.',
    chooseSubject: 'Velg fag',
  },
  topicPage: {
    topicErrorDescription:
      'Beklager, en feil oppsto under lasting av emneinnholdet.',
    articleErrorDescription:
      'Beklager, en feil oppsto under lasting av emnebeskrivelsen.',
    topic: 'EMNE',
    topics: 'Emner',
  },
  welcomePage: {
    subjects: 'Fag',
    search: 'Gå til søk',
    errorDescription: 'Beklager, en feil oppsto under lasting av fagene.',
  },
  meta: {
    description:
      'Kvalitetssikrede fritt tilgjengelige nettbaserte læremidler for videregående opplæring',
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
      contentTypeResultsNoHit: 'Ingen treff',
    },
  },
  logo: {
    altText: 'Nasjonal digital læringsarena',
  },
  resource: {
    errorDescription:
      'Beklager, men en feil oppsto under lasting av emneressurser.',
    noCoreResourcesAvailable: 'Det er ikke noe kjernestoff tilgjengelig.',
    activateAdditionalResources: 'Vis tilleggsstoff',
    toggleFilterLabel: 'Tilleggsstoff',
    showLess: 'Vis mindre',
    showMore: 'Vis mer',
  },
  searchForm: {
    placeholder: 'Søk etter artikler',
    btn: 'Søk',
    order: {
      relevance: 'Relevans',
      title: 'Alfabetisk',
    },
  },
  article: {
    lastUpdated: 'Sist oppdatert',
    edition: 'Utgave',
    publisher: 'Utgiver',
    closeLicenseBox: 'Lukk boks',
    openLicenseBox: 'Bruk artikkel',
  },
  subject: {
    associatedTopics: 'Tilhørende emner',
  },
  license: {
    heading: 'Slik gjenbruker du innhold',
    learnMore: 'Lær mer om åpne lisenser',
    copyTitle: 'Kopier referanse',
    hasCopiedTitle: 'Kopiert!',
    embed: 'Bygg inn',
    embedCopied: 'Kopierte innbyggingskode!',
    download: 'Last ned',
    tabs: {
      text: 'Tekst',
      images: 'Bilder',
      audio: 'Lyd',
      video: 'Video',
    },
    images: {
      heading: 'Slik bruker du bilder fra artikkelen',
      description:
        'Husk å kopiere teksten som skal legges ved bildet der du bruker det.',
      rules: 'Regler for bruk av bildet:',
      source: 'Kilde',
      title: 'Tittel',
    },
    text: {
      heading: 'Slik bruker du tekst fra artikkelen',
      description:
        'Artikkelen kan være sammensatt av flere tekster som listes opp her.',
      rules: 'Regler for bruk av teksten:',
      published: 'Publiseringsdato',
    },
    audio: {
      heading: 'Slik bruker du lydfiler',
      description:
        'Husk å kopiere teksten som skal legges ved lydfilen der du bruker den.',
      rules: 'Regler for bruk av lydfilen:',
    },
    video: {
      heading: 'Slik bruker du video fra artikkelen',
      description:
        'Husk å kopiere teksten som skal legges ved videoen der du bruker den.',
      rules: 'Regler for bruk av videoen:',
    },
    creditType: {
      originator: 'Opphavsmann',
      photographer: 'Fotograf',
      artist: 'Kunstner',
      editorial: 'Redaksjonelt',
      writer: 'Forfatter',
      scriptwriter: 'Manusforfatter',
      reader: 'Innleser',
      translator: 'Oversetter',
      director: 'Regissør',
      illustrator: 'Illustratør',
      cowriter: 'Medforfatter',
      composer: 'Komponist',
      processor: 'Bearbeider',
      facilitator: 'Tilrettelegger',
      linguistic: 'Språklig',
      idea: 'Idé',
      compiler: 'Sammenstiller',
      correction: 'Korrektur',
      rightsholder: 'Rettighetshaver',
      publisher: 'Forlag',
      distributor: 'Distributør',
      supplier: 'Leverandør',
    },
  },
  errorMessage: {
    title: 'Ops, noe gikk galt',
    description: 'Beklager, en feil oppsto.',
    back: 'Tilbake',
    goToFrontPage: 'Gå til forsiden',
  },
  footer: {
    aboutNDLA: 'Om NDLA',
    selectLanguage: 'Velg språk (language): ',
    footerInfo: 'Nettstedet er utarbeidet av NDLA med åpen kildekode.',
    footerEditiorInChief: 'Ansvarlig redaktør: ',
    footerManagingEditor: 'Utgaveansvarlig: ',
  },
};

export default phrases;
