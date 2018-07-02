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
      subHeading: '{totalCount} treff i Ndla',
    },
    searchResultListMessages: {
      subjectsLabel: 'Opne i fag:',
      noResultHeading: 'Hmm, ikkje noko innhald ...',
      noResultDescription:
        'Vi har dessverre ikkje noko å tilby her. Om du vil foreslå noko innhald til dette området, kan du bruke Spør NDLA som du finn nede til høgre på skjermen.',
    },
    searchPageMessages: {
      filterHeading: 'Filter',
      resultHeading: '{totalCount} treff i Ndla',
      narrowScreenFilterHeading: '{totalCount} treff på «{query}»',
    },
    searchFilterMessages: {
      backButton: 'Tilbake til filter',
      filterLabel: 'Vel fag',
      confirmButton: 'Bruk fag',
      hasValuesButtonText: 'Byt fag',
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
      heading: 'Mest lese',
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
        'NDLA har mange Facebook og Twitter kontoar. Finn den som passar for deg og følg oss!',
      mainLink: {
        name: 'Følg oss',
      },
    },
    aboutNDLA: {
      heading: 'Om NDLA',
      description:
        'NDLAs visjon er å lage gode, opne digitale læremiddel for alle fag i videregående opplæring og støtte opp om elevar og lærarar i aktivt og deltakende læringsarbeid.',
      mainLink: {
        name: 'Meir om Ndla',
      },
    },
    category: {
      fellesfag: 'Fellesfag',
      yrkesfag: 'Yrkesfag',
      all: 'Alle fag',
    },
    errorDescription: 'Orsak, ein feil oppstod under lasting av faga.',
    beta: {
      info:
        'Alt innhold vil ikke være med i betaversjonen. Vi har prioritert kjernestoff framfor tilleggsstoff. Noen emner og fagstoff kan mangle.',
      title: 'Vil du hjelpe oss å teste de nye fagssidene?',
      intro: `Til nå har vi brukertestet over 100 elever og lærere og fått mange
      gode tilbakemeldinger og forslag. Tusen takk for all hjelp så langt!
      Nå vil vi gjerne ha din hjelp til å forbedre nettsidene enda mer.`,
      whatHelp: 'Hva trenger vi din hjelp til?',
      help: `Vi vil gjerne at du bruker sidene som du pleier når du jobber med
      læring. Hvis du tenker at noe er rart, uvant, bra eller dårlig – så
      kan du raskt melde fra til oss med knappen “spør NDLA” nede i hjørnet.`,
      tips: `Vi leser alle tips, klager eller spørsmål som kommer inn og er veldig
      takknemlige - fordi det hjelper oss til å bli bedre!`,
      whatsNew: 'Hva er nytt?',
      item1: 'ny struktur',
      item2: 'nye sider for fagstoffet',
      item3: 'nytt design',
      newStructure: 'Ny struktur',
      structure: `Vi har satt sammen innholdet på NDLA på en måte som gjør det lettere
      for deg å finne frem. Alle emner har fått en kort introduksjon som du
      kan lese hvis du vil ha en liten innføring i hva fagstoffet dreier seg
      om.`,
      newContent: 'Nye sider for fagstoffet',
      content: `Sidene har nå større tekst og mer luft. Da blir det lettere å lese
      innholdet og ikke minst forstå det som står der. Vi har fjernet
      elementer, slik at de ikke skal forstyrre.`,
      newLp: 'Læringsstier',
      lp: `Læringsstier er en ny måte å sette sammen lærestoffet på. Fagstoff,
      oppgaver og aktiviteter blir kombinert i en bestemt rekkefølge. I
      denne betaversjonen vil du finne redaksjonelt kvalitetssikrede
      læringsstier fra NDLA, der læringsaktivitetene er pedagogisk
      organisert.`,
      newDesign: 'Nytt design',
      design: `Vi har blitt lysere og luftigere og håper du liker det. Vi har fått
      fine, nye farger og ikoner som følger innholdet og hjelper deg til å
      forstå om du leser om et emne, fagstoff eller en oppgave. Menyen gir
      bedre oversikt og ligger bak en knapp, slik at den ikke er i veien når
      du skal lese. Logoen vår er den samme, så du kjenner oss nok igjen.`,
      whatNow: 'Hva jobber vi med videre?',
      soon: `Snart vil vi lansere nye forsider for fagene og en forbedret versjon
      av læringsstier. Vi vet at elever søker mye og derfor ønsker vi å lage
      et skikkelig bra søk. Vi kommer til å gjøre en rekke tilpasninger
      basert på tilbakemeldingene fra dere. Hovedmålet er hele tiden å legge
      til rette for best mulig læring!`,
    },
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
      contentTypeResultsShowLess: 'Vis mindre',
      contentTypeResultsNoHit: 'Ingen treff',
      betaInfoFront: 'Velkommen til betaversjonen av ndla.no',
      betaInfo: 'Du tester nå de nye nettsidene. ',
      readMore: 'Les mer om nye NDLA.no',
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
    tooltipCoreTopic: 'Kjernestoff er fagstoff som er på pensum',
    tooltipAdditionalTopic: 'Tilleggsstoff er fagstoff som ikkje er på pensum',
    additionalTooltip: 'Tilleggsstoff er ikkje på pensum',
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
      authorDesc: 'Denne artikkelen er laget av flere opphavsmenn',
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
  contentTypes: {
    all: 'Alle',
    subject: 'Emne',
    'topic-article': 'Emne',
    'learning-path': 'Læringssti',
    'subject-material': 'Fagstoff',
    'tasks-and-activities': 'Oppgåver og aktivitetar',
    'external-learning-resources': 'Ekstern læringsressurs',
    'source-material': 'Kjeldemateriale',
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
