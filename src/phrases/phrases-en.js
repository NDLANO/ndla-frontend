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
    welcomePage: `Frontpage${titleTemplate}`,
    topicPage: 'Topic',
    subjectsPage: `Choose subjects${titleTemplate}`,
    searchPage: `Search${titleTemplate}`,
    notFound: `Page not found${titleTemplate}`,
  },
  articlePage: {
    errorDescription: 'Sorry, an error occurd while loading the resource.',
    error404Description:
      "Sorry, we can't locate the resource you are looking for.",
  },
  notFoundPage: {
    errorDescription: "We can't seem to find the page you are looking for.",
  },
  searchPage: {
    noHits: 'Your search - {query} - did not match any articles. ',
  },
  subjectPage: {
    errorDescription: 'Sorry, an error occurd while loading the topics.',
    tabs: {
      topics: 'Topics',
    },
  },
  subjectsPage: {
    chooseSubject: 'Choose subject',
    errorDescription: 'Sorry, an error occurd while loading the subjects.',
  },
  topicPage: {
    topicErrorDescription:
      'Sorry, an error occurd while loading topic content.',
    articleErrorDescription:
      'Sorry, an error occurd while loading the topic description.',
    topic: 'TOPIC',
    topics: 'Topics',
  },
  welcomePage: {
    subjects: 'Subjects',
    search: 'Search',
    errorDescription: 'Sorry, an error occurd while loading the subjects.',
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
    description: 'Norwegian Digital Learning Arena, Open Educational Resources',
  },
  masthead: {
    menu: {
      close: 'Close',
      goTo: 'Go to',
      search: 'Search',
      subjectOverview: 'Subject overview',
      title: 'Menu',
      subjectPage: 'Subject front page',
      learningResourcesHeading: 'Educational Resources',
      back: 'Back',
      contentTypeResultsShowMore: 'Show more',
      contentTypeResultsNoHit: 'No hits',
      betaInfoFront: 'Velkommen til betaversjonen av ndla.no',
      betaInfo: 'Du tester nå de nye nettsidene. ',
      readMore: 'Les mer om nye NDLA.no',
    },
  },
  logo: {
    altText: 'The Norwegian Digital Learning Arena',
  },
  resource: {
    errorDescription:
      'Sorry, an error occurd while loading the topic resources.',
    noCoreResourcesAvailable: 'There is no core content available.',
    activateAdditionalResources: 'Show additional content',
    toggleFilterLabel: 'Additional content',
    showLess: 'Show less',
    showMore: 'Show more',
  },
  searchForm: {
    placeholder: 'Search articles',
    btn: 'Search',
    order: {
      relevance: 'Relevance',
      title: 'Alphabetical',
    },
  },
  article: {
    author: 'Author',
    published: 'Published',
    edition: 'Edition',
    publisher: 'Publisher',
    created: 'Created',
    lastUpdated: 'Last updated',
    closeLicenseBox: 'Close box',
    openLicenseBox: 'Cite or use',
  },
  subject: {
    associatedTopics: 'Associated topics',
  },
  license: {
    heading: 'Howto reuse content',
    tabs: {
      text: 'Text',
      images: 'Images',
      audio: 'Audio',
      video: 'Video',
    },
    images: {
      heading: 'How to use images from the article',
      description:
        'Remember to copy the text to be attached to the image where you use it.',
      rules: 'Rules for use of image:',
      source: 'Source',
      title: 'Title',
    },
    text: {
      heading: 'How to use text from the article',
      description:
        'The article may be composed of several different texts, which are listed here.',
      rules: 'Rules for use of text:',
      published: 'Published',
    },
    audio: {
      heading: 'How to use audio files from the article',
      description:
        'Remember to copy the text to be attached to the audio where you use it.',
      rules: 'Rules for use of audio file:',
    },
    video: {
      heading: 'How to use videos from the article',
      description:
        'Remember to copy the text to be attached to the video where you use it.',
      rules: 'Rules for use of audio file:',
    },
    learnMore: 'Learn more about open licenses',
    copyTitle: 'Copy reference',
    embed: 'Embed',
    embedCopied: 'Copied embed code!',
    hasCopiedTitle: 'Copied!',
    download: 'Download',
    creditType: {
      originator: 'Originator',
      photographer: 'Photographer',
      artist: 'Artist',
      editorial: 'Editorial',
      writer: 'Writer',
      scriptwriter: 'Scriptwriter',
      reader: 'Reader',
      translator: 'Translator',
      director: 'Director',
      illustrator: 'Illustrator',
      cowriter: 'Cowriter',
      composer: 'Composer',
      processor: 'Processor',
      facilitator: 'facilitator',
      linguistic: 'Linguistic',
      idea: 'Idea',
      compiler: 'Compiler',
      correction: 'Correction',
      rightsholder: 'Rightsholder',
      publisher: 'Publisher',
      distributor: 'Distributor',
      supplier: 'Supplier',
    },
  },
  errorMessage: {
    title: 'Oops, something went wrong',
    description: 'Sorry, an error occurd.',
    back: 'Back',
    goToFrontPage: 'Go to frontpage',
  },
  footer: {
    aboutNDLA: 'About NDLA',
    selectLanguage: 'Choose language (språk): ',
    footerInfo: 'This webapplication is developed by NDLA as Open Source code.',
    footerEditiorInChief: 'Editor in chief: ',
    footerManagingEditor: 'Managing editor: ',
  },
};

export default phrases;
