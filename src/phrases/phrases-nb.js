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
  askNDLA: 'Spør NDLA',
  articlePage: {
    errorDescription: 'Beklager, en feil oppsto under lasting av ressursen.',
    error404Description: 'Beklager, finner ikke ressursen du leter etter.',
  },
  notFoundPage: {
    errorDescription: 'Beklager, finner ikke siden du prøvde å komme til.',
  },
  searchPage: {
    noHits: 'Ingen artikler samsvarte med søket ditt på: {query}',
    search: 'Søk',
    close: 'Lukk',
    searchFieldPlaceholder:
      'Søk i fagstoff, oppgaver og aktiviteter eller læringsstier',
    label: {
      contentTypes: 'Innholdstyper',
      levels: 'Nivå',
      'language-filter': 'Språk',
      subjects: 'Fag',
    },
    showLabel: {
      contentTypes: 'Flere innholdstyper',
      levels: 'Flere nivåer',
      'language-filter': 'Flere språk',
      subjects: 'Bytt fag',
    },
    hideLabel: {
      contentTypes: 'Færre innholdstyper',
      levels: 'Færre nivåer',
      'language-filter': 'Færre språk',
      subjects: 'Færre fag',
    },
    searchField: {
      contentTypeResultShowMoreLabel: 'Se flere resultater',
      contentTypeResultShowLessLabel: 'Se færre resultater',
      allResultButtonText: 'Vis alle søketreff',
      searchResultHeading: 'Forslag:',
      contentTypeResultNoHit: 'Ingen treff',
    },
    searchResultMessages: {
      searchStringLabel: 'Du søkte på:',
      subHeading: '{totalCount} treff i Ndla',
    },
    searchResultListMessages: {
      subjectsLabel: 'Åpne i fag:',
      noResultHeading: 'Hmm, ikke noe innhold ...',
      noResultDescription:
        'Vi har dessverre ikke noe å tilby her. Hvis du vil foreslå noe innhold til dette området, kan du bruke Spør NDLA som du finner nede til høyre på skjermen.',
    },
    searchPageMessages: {
      filterHeading: 'Filter',
      resultHeading: '{totalCount} treff i Ndla',
      narrowScreenFilterHeading: '{totalCount} treff på «{query}»',
    },
    searchFilterMessages: {
      backButton: 'Tilbake til filter',
      filterLabel: 'Velg fag',
      confirmButton: 'Bruk fag',
      hasValuesButtonText: 'Bytt fag',
      noValuesButtonText: 'Velg fag',
    },
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
    errorDescription:
      'Beklager, men en feil oppsto under lasting av emneressurser.',
    noCoreResourcesAvailable: 'Det er ikke noe kjernestoff tilgjengelig.',
    activateAdditionalResources: 'Vis tilleggsstoff',
    toggleFilterLabel: 'Tilleggsstoff',
    showLess: 'Vis mindre',
    showMore: 'Vis mer',
  },
  article: {
    lastUpdated: 'Sist oppdatert',
    edition: 'Utgave',
    publisher: 'Utgiver',
    closeLicenseBox: 'Lukk boks',
    openLicenseBox: 'Bruk innhold',
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
  contentTypes: {
    all: 'Alle',
    subject: 'Emne',
    'topic-article': 'Emne',
    'learning-path': 'Læringssti',
    'subject-material': 'Fagstoff',
    'tasks-and-activities': 'Oppgaver og aktiviteter',
    'external-learning-resources': 'Ekstern læringsressurs',
    'source-material': 'Kildemateriale',
  },
  languages: {
    nb: 'Norsk',
    nn: 'Nynorsk',
    en: 'Engelsk',
    fr: 'Fransk',
    de: 'Tysk',
    se: 'Samisk',
    es: 'Spansk',
    zh: 'Kinesisk',
    unkown: 'Ukjent',
  },
};

export default phrases;
