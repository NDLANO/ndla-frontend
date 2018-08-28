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
    welcomePage: `Framsida${titleTemplate}`,
    topicPage: 'Emne',
    subjectsPage: `Velg fag${titleTemplate}`,
    searchPage: `Søk${titleTemplate}`,
    notFound: `Sida finst ikkje${titleTemplate}`,
  },
  newsLetter: {
    heading: 'Nyheitsbrev',
    description: 'Hald deg oppdatert. Abonnér på siste nytt frå NDLA.',
    mainLinkName: 'Meld deg på',
    iconLinkName: 'Meld deg på nyheitsbrev',
  },
  askNDLA: 'Spør NDLA',
  articlePage: {
    errorDescription: 'Orsak, ein feil oppstod under lasting av ressursen.',
    error404Description:
      'Orsak, vi kunne ikkje finne ressursen du leiter etter.',
  },
  notFoundPage: {
    errorDescription: 'Orsak, vi fann ikkje sida du prøvde å kome til.',
  },
  searchPage: {
    noHits: 'Ingen artiklar samsvarte med søket ditt på: {query}',
    search: 'Søk',
    abilities: 'Egenskaper',
    close: 'Lukk',
    searchFieldPlaceholder:
      'Søk i fagstoff, oppgåver og aktivitetar eller læringsstiar',
    label: {
      contentTypes: 'Innhaldstypar',
      levels: 'Nivå',
      'language-filter': 'Språk',
      noFilter: 'Ingen filter valde',
      subjects: 'Fag',
    },
    showLabel: {
      contentTypes: 'Fleire innhaldstypar',
      levels: 'Fleire nivå',
      'language-filter': 'Fleire språk',
      subjects: 'Bytt fag',
    },
    hideLabel: {
      contentTypes: 'Færre innhaldstypar',
      levels: 'Færre nivå',
      'language-filter': 'Færre språk',
      subjects: 'Færre fag',
    },
    searchField: {
      contentTypeResultShowMoreLabel: 'Sjå fleire resultat',
      contentTypeResultShowLessLabel: 'Sjå færre resultat',
      allResultButtonText: 'Vis alle søketreff',
      searchResultHeading: 'Forslag:',
      contentTypeResultNoHit: 'Ingen treff',
    },
    searchResultMessages: {
      searchStringLabel: 'Du søkte på:',
      subHeading: '{totalCount} treff i NDLA',
    },
    searchResultListMessages: {
      subjectsLabel: 'Opne i fag:',
      noResultHeading: 'Hmm, ikkje noko innhald ...',
      noResultDescription:
        'Vi har dessverre ikkje noko å tilby her. Om du vil foreslå noko innhald til dette området, kan du bruke Spør NDLA som du finn nede til høgre på skjermen.',
    },
    searchPageMessages: {
      filterHeading: 'Filter',
      resultHeading: '{totalCount} treff i NDLA',
      narrowScreenFilterHeading: '{totalCount} treff på «{query}»',
      dropdownBtnLabel: 'Fleire innhaldstypar',
    },
    searchFilterMessages: {
      backButton: 'Tilbake til filter',
      filterLabel: 'Vel fag',
      confirmButton: 'Oppdater filter',
      hasValuesButtonText: 'Fleire fag',
      noValuesButtonText: 'Vel fag',
    },
  },
  subjectPage: {
    errorDescription: 'Orsak, ein feil oppstod under lasting av emnene.',
    tabs: {
      topics: 'Emne',
    },
    subjectShortcuts: {
      heading: 'Gå direkte til',
      showMore: 'Vis fleire',
      showLess: 'Vis færre',
    },
    mostRead: {
      heading: 'Mest brukt',
    },
    editorsChoices: {
      heading: 'Litt forskjellig frå faget',
      unknown: 'Ukjend',
    },
    subjectArchive: {
      heading: 'Aktuelt',
      archive: 'Arkiv',
      close: 'Lukk',
    },
    subjectFilter: {
      label: 'Filter',
    },
    newContent: {
      heading: 'Nytt innhald',
    },
  },
  subjectsPage: {
    errorDescription: 'Orsak, ein feil oppstod under lasting av faga.',
    chooseSubject: 'Vel fag',
  },
  topicPage: {
    articleErrorDescription:
      'Orsak, ein feil oppstod under lasting av emneskildringa.',
    topic: 'EMNE',
    topics: 'Emner',
  },
  welcomePage: {
    search: 'Søk',
    highlighted: 'Aktuelt',
    heading: {
      heading: 'Nasjonal digital læringsarena',
      searchFieldPlaceholder: 'Søk etter f.eks emne, lærestoff, nykelord...',
      messages: {
        searchFieldTitle: 'Søk',
        menuButton: 'Meny',
      },
      links: {
        aboutNDLA: 'Om NDLA',
        changeLanguage: 'Skift språk',
      },
    },
    socialMedia: {
      heading: 'Følg oss',
      description:
        'NDLA har mange Facebook- og Twitterkontoar. Finn den som passar for deg, og følg oss!',
      mainLink: {
        name: 'Følg oss',
      },
    },
    aboutNDLA: {
      heading: 'Om NDLA',
      description:
        'NDLAs visjon er å lage gode, opne digitale læremiddel for alle fag i videregående opplæring og støtte opp om elevar og lærarar i aktivt og deltakende læringsarbeid.',
      mainLink: {
        name: 'Meir om NDLA',
      },
    },
    category: {
      fellesfag: 'Fellesfag',
      yrkesfag: 'Yrkesfag',
      studiespesialiserende: 'Studiespesialiserende',
      imported: 'Spoltefag',
    },
    film: {
      header: 'NDLA film',
      text:
        'NDLA film er ei teneste i samarbeid med Norgesfilm. Denne tenesta lar deg sjå ei rekkje spelefilmar, kortfilmar, dokumentarar og seriar. Du kan òg sjå undervisningsfilm og filmklipp. Velkomen inn i filmen si verd!',
      linkLabel: 'Gå til NDLA film',
    },
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
      subjectOverview: 'Alle fag',
      title: 'Meny',
      subjectPage: 'Fagforside',
      learningResourcesHeading: 'Læringsressurser',
      back: 'Tilbake',
      contentTypeResultsShowMore: 'Vis mer',
      contentTypeResultsShowLess: 'Vis mindre',
      contentTypeResultsNoHit: 'Ingen treff',
    },
  },
  logo: {
    altText: 'Nasjonal digital læringsarena',
  },
  resource: {
    errorDescription: 'Orsak, ein feil oppstod under lasting av emneressursar.',
    noCoreResourcesAvailableUnspecific:
      'Det er ikkje noko kjernestoff tilgjengeleg.',
    noCoreResourcesAvailable:
      'Det er ikkje noko kjernestoff tilgjengeleg for {name}.',
    toggleFilterLabel: 'Tilleggsressursar',
    activateAdditionalResources: 'Vis tilleggsressursar',
    label: 'Læringsressursar',
    shortcutButtonText: 'Lærestoff',
    tooltipCoreTopic: 'Kjernestoff er fagstoff',
    tooltipAdditionalTopic: 'Tilleggsstoff er fagstoff',
    additionalTooltip: 'Tilleggsstoff',
    dialogTooltip: 'Kva er kjernestoff og tilleggsstoff?',
    dialogHeading: 'Kjernestoff og tilleggsstoff',
    dialogText1:
      'Når du lærar deg kjernestoffet skaffar du deg den kompetansen som beskrives i læreplanen for faget.',
    dialogText2:
      'Tilleggstoff er innhald i faget som du kan velje i tillegg til kjernestoffet. Gjennom tilleggsstoffet kan du fordjupe deg i et emne eller tilnærma deg emnet på en anna måte.',
    showLess: 'Vis mindre',
    showMore: 'Vis mer',
  },
  article: {
    lastUpdated: 'Sist oppdatert',
    edition: 'Utgåve',
    publisher: 'Utgjevar',
    closeLabel: 'Lukk',
    useContent: 'Bruk innhald',
    additionalLabel: 'Tilleggsstoff',
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
      authorDesc: 'Denne artikkelen er laget av fleire opphavsmenn',
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
    linksTitle: 'Kjem igang:',
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
  contentTypes: {
    all: 'Alle',
    subject: 'Emne',
    'topic-article': 'Emne',
    'learning-path': 'Læringssti',
    'subject-material': 'Fagstoff',
    'tasks-and-activities': 'Oppgåver og aktivitetar',
    'external-learning-resources': 'Ekstern læringsressurs',
    'source-material': 'Kjeldemateriale',
    'assessment-resources': 'Vurderingsressurs',
  },
  languages: {
    nb: 'Bokmål',
    nn: 'Nynorsk',
    en: 'Engelsk',
    fr: 'Fransk',
    de: 'Tysk',
    se: 'Samisk',
    es: 'Spansk',
    zh: 'Kinesisk',
    unkown: 'Ukjent',
  },
  breadcrumb: {
    toFrontpage: 'Til framsida',
  },
};

export default phrases;
