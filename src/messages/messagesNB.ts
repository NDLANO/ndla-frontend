/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const titleTemplate = "NDLA";

const messages = {
  htmlTitles: {
    titleTemplate,
    welcomePage: `Forsiden - ${titleTemplate}`,
    topicPage: "Emne",
    subjectsPage: `Alle fag - ${titleTemplate}`,
    searchPage: `Søk - ${titleTemplate}`,
    notFound: `Siden finnes ikke - ${titleTemplate}`,
    unpublished: `Ressursen er avpublisert - ${titleTemplate}`,
    accessDenied: `Ingen tilgang - ${titleTemplate}`,
    subject: "Fag",
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
    arenaPage: `Arena - ${titleTemplate}`,
    arenaAdminPage: `Administrer Arena - ${titleTemplate}`,
    arenaTopicPage: `{{name}} - Arena - ${titleTemplate}`,
    arenaPostPage: `{{name}} - Arena - ${titleTemplate}`,
    arenaNewTopicPage: `Nytt innlegg - Arena - ${titleTemplate}`,
    arenaNewCategoryPage: `Ny kategori - Arena - ${titleTemplate}`,
  },
  menu: {
    about: "Om oss",
    subjectAndProgramme: "Fag og utdanningsprogram",
    tipsAndAdvice: "Tips og råd",
    goBack: "Gå tilbake",
  },
  podcastPage: {
    meta: "Lytt og lær! NDLA har mer enn 100 fritt tilgjengelige podkaster for engasjerende bruk i videregående opplæring.",
    episodes: "Episoder",
    podcast: "Podkast",
    podcasts: "Podkaster",
    noResults: "...Ingen episoder",
    subtitle: "Lytt og lær!",
    pagination: "Podkastsider",
  },
  subjectsPage: { tabFilter: { label: "Hvilke fag vil du vise?", all: "Alle fag og ressurser" } },
  searchPage: {
    title: "Søk på ndla.no",
    filterSearch: "Filtrer søket ditt:",
    subjectLetter: "Fag som starter på {{letter}}",
    resourceTypeFilter: "Ressurstyper",
  },
  myndla: {
    tagsTitle: "Mine emneknagger",
    campaignBlock: {
      title: "Prøv vår praterobot",
      linkText: "Prøv NDLAs prateroboter",
      ingressStudent:
        "Lurer du på noe i faget ditt? Vil du ha hjelp til å forenkle en tekst, øve til en prøve eller få forslag til en disposisjon? Prøv prateroboten vår og se om den kan hjelpe deg! I perioder med eksamensgjennomføring kan det hende fylkeskommunen stenger tilgangen til praterobotene.",
      ingress:
        "Vil du bruke KI i undervisninga? NDLA har laget to prateroboter som tar vare på personvernet ditt og trygt kan brukes til jobb og i undervisning. I perioder med eksamensgjennomføring kan det hende fylkeskommunen stenger tilgangen til praterobotene.",
      ingressUnauthenticated:
        "Vil du bruke KI i undervisninga? NDLA har laget to prateroboter som tar vare på personvernet ditt og trygt kan brukes til jobb og i undervisning. I perioder med eksamensgjennomføring kan det hende fylkeskommunen stenger tilgangen til praterobotene. Logg inn for å få tilgang til praterobotene.",
    },
    resource: {
      addedToFolder: 'Ressurs er lagt i "{{folder}}"',
      added: "Lagt til",
      removed: "Fjernet",
      showTags: "Vis emneknagger",
      tagsDialogTitle: "Emneknagger knyttet til ressurs {{title}}",
      noTags: "Ingen emneknagger.",
    },
  },
  myNdla: {
    sharedFolder: {
      learningpathUnsupportedTitle: "Læringsstier støttes ikke",
      resourceRemovedTitle: "Ressurs ikke tilgjengelig",
    },
    arena: {
      notification: {
        description:
          "Velkommen inn i arenaen for lærere i videregående opplæring! Dette er <em>din</em> arena: et faglig møtested for diskusjon, inspirasjon, deling og utviklende samarbeid.",
      },
      reported: "Innhold rapportert",
      error: "En feil oppstod",
      userUpdated: "Bruker oppdatert",
    },
  },
  ndlaFilm: {
    films: "Filmer",
    topics: "Emner",
    filterFilms: "Filtrer filmer",
  },
  validation: {
    fields: {
      name: "Navn",
      description: "Beskrivelse",
      title: "Tittel",
      content: "Innhold",
    },
    required: "Dette feltet er påkrevd",
    requiredField: "$t(validation.fields.{{field}}) kan ikke være tom",
    notUnique: "Finnes allerede",
    maxLength: "Dette feltet kan maks inneholde {{count}} tegn",
    maxLengthField: "$t(validation.fields.{{field}}) kan maks innholde {{count}} tegn",
  },
  lti: {
    goBack: "Tilbake til LTI-søk",
  },
  resourcepageTitles: {
    video: "Video",
    image: "Bilde",
    audio: "Audio",
    concept: "Forklaring",
  },
  contentTypes: {
    multidisciplinary: "Tverrfaglig tema",
  },
  markdownEditor: {
    link: {
      url: "Lenkeadresse",
      text: "Lenketekst",
      error: {
        url: {
          empty: "Lenkeadressa kan ikke være tom",
          invalid: "Ugyldig lenkeadresse. Følg formatet https://ndla.no",
        },
        text: {
          empty: "Lenketeksten kan ikke være tom",
        },
      },
    },
    toolbar: {
      bold: {
        active: "Fjern fet skrift",
        inactive: "Legg til fet skrift",
      },
      italic: {
        active: "Fjerne kursiv skrift",
        inactive: "Legg til kursiv skrift",
      },
      unorderedList: {
        active: "Fjern punktliste",
        inactive: "Legg til punktliste",
      },
      orderedList: {
        active: "Fjern nummerert liste",
        inactive: "Legg til nummerert liste",
      },
      link: {
        active: "Fjern lenke",
        inactive: "Legg til lenke",
      },
    },
  },
  multidisciplinary: {
    casesCount: "{{count}} caser",
  },
  tabs: {
    competenceGoals: "Kategorier",
    licenseBox: "Innholdstyper",
    subjectFilter: "Fagkategorier",
  },
  masthead: {
    search: "Søk på ndla.no",
    moreHits: "Vis flere treff",
  },
  pagination: { next: "Neste", prev: "Forrige" },
  programmePage: {
    programmeSubjects: "Programfag",
  },
  subjectPage: {
    topicsTitle: "Emner i {{topic}}",
  },
  aboutPage: {
    nav: "Informasjonssider",
  },
  welcomePage: {
    programmes: "Utdanningsprogram",
  },
  learningpathPage: {
    accordionTitle: "Innhold i læringssti",
    learningsteps: "Læringssteg",
    stepCompleted: "Fullført",
  },
  movedResourcePage: {
    title: "Siden har flyttet, men du finner den her:",
    openInSubject: "Åpne artikkelen i et fag:",
  },
};

export default messages;
