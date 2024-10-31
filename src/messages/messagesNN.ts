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
    welcomePage: `Framsida - ${titleTemplate}`,
    topicPage: "Emne",
    subjectsPage: `Alle fag - ${titleTemplate}`,
    searchPage: `Søk - ${titleTemplate}`,
    notFound: `Sida finst ikkje - ${titleTemplate}`,
    forbidden: `Tilgang nektet - ${titleTemplate}`,
    unpublished: `Ressursen er avpublisert - ${titleTemplate}`,
    accessDenied: `Ingen tilgang - ${titleTemplate}`,
    subject: "Fag",
    podcast: `Podkast - Side {{page}} - ${titleTemplate}`,
    lti: `LTI - ${titleTemplate}`,
    movedResourcePage: `Sida har flytta - ${titleTemplate}`,
    myNdlaPage: `Min NDLA - ${titleTemplate}`,
    myFoldersPage: `Mine mapper - ${titleTemplate}`,
    myFolderPage: `{{folderName}} - ${titleTemplate}`,
    myTagPage: `#{{tag}} - ${titleTemplate}`,
    myTagsPage: `Mine emneknaggar - ${titleTemplate}`,
    sharedFolderPage: `{{name}} - ${titleTemplate}`,
    aboutPage: `{{name}} - ${titleTemplate}`,
    arenaPage: `Arena - ${titleTemplate}`,
    arenaAdminPage: `Administrer Arena - ${titleTemplate}`,
    arenaTopicPage: `{{name}} - Arena - ${titleTemplate}`,
    arenaPostPage: `{{name}} - Arena - ${titleTemplate}`,
    arenaNewTopicPage: `Nytt innlegg - Arena - ${titleTemplate}`,
    arenaNewCategoryPage: `Ny kategori - Arena - ${titleTemplate}`,
    learningpathPage: `Mine læringsstiar - ${titleTemplate}`,
  },
  menu: {
    about: "Om oss",
    subjectAndProgramme: "Fag og utdanningsprogram",
    tipsAndAdvice: "Tips og råd",
    goBack: "Gå tilbake",
  },
  podcastPage: {
    meta: "Lytt og lær! NDLA har meir enn 100 fritt tilgjengelege podkastar for engasjerande bruk i vidaregåande opplæring.",
    episodes: "Episoder",
    podcast: "Podkast",
    podcasts: "Podkaster",
    noResults: "...Ingen episoder",
    subtitle: "Lytt og lær!",
    pagination: "Podkastsider",
  },
  subjectsPage: { tabFilter: { label: "Kva fag vil du visa?", all: "Alle fag og ressursar" } },
  searchPage: {
    title: "Søk på ndla.no",
    filterSearch: "Filtrer søket ditt:",
    subjectLetter: "Fag som startar på {{letter}}",
    resourceTypeFilter: "Ressurstyper",
  },
  myndla: {
    tagsTitle: "Mine emneknaggar",
    campaignBlock: {
      title: "Prøv praterobotane våre",
      linkText: "Prøv praterobotar på NDLA",
      ingressStudent:
        "Vil du ha hjelp til å forenkle ein tekst, øve til ein prøve eller lage illustrasjonar? Prøv robotane våre og sjå om dei kan hjelpe deg! I periodar med eksamensgjennomføring stenger fylkeskommunene tilgangen til robotane.",
      ingress:
        "Vil du bruke KI i undervisninga? NDLA har laga praterobotar og ein biletrobot som trygt kan brukast i jobb og undervisning. I periodar med eksamensgjennomføring stenger fylkeskommunene tilgangen til robotane.",
      ingressUnauthenticated:
        "Vil du bruke KI i undervisninga? NDLA har laga praterobotar og ein biletrobot som trygt kan brukast til jobb og i undervisning. Logg inn for å få tilgang til robotane.",
    },
    resource: {
      addedToFolder: 'Ressurs er lagt i "{{folder}}"',
      added: "Lagt til",
      removed: "Fjernet",
      showTags: "Vis emneknaggar",
      tagsDialogTitle: "Emneknaggar tilknytta ressurs {{title}}",
      noTags: "Ingen emneknaggar.",
    },
  },
  myNdla: {
    sharedFolder: {
      learningpathUnsupportedTitle: "Læringsstier støttast ikkje",
      resourceRemovedTitle: "Ressurs ikkje tilgjengeleg",
    },
    arena: {
      notification: {
        description:
          "Velkommen inn i arenaen for lærarar i vidaregåande opplæring! Dette er <em>din</em> arena: ein fagleg møtestad for diskusjon, inspirasjon, deling og utviklande samarbeid.",
      },
      reported: "Innhald rapportert",
      error: "Ein feil oppstod",
      userUpdated: "Bruker oppdatert",
    },
  },
  ndlaFilm: {
    films: "Filmar",
    topics: "Emner",
    filterFilms: "Filtrer filmar",
  },
  validation: {
    fields: {
      name: "Namn",
      title: "Tittel",
      content: "Innhald",
      description: "Beskriving",
    },
    required: "Dette feltet er påkrevd",
    requiredField: "$t(validation.fields.{{field}}) kan ikkje være tom",
    notUnique: "Finnes allereie",
    maxLength: "Dette feltet kan maks innehalde {{count}} teikn",
    maxLengthField: "$t(validation.fields.{{field}}) kan maks innehalde {{count}} teikn",
  },
  lti: {
    goBack: "Tilbake til LTI-søk",
  },
  resourcepageTitles: {
    video: "Video",
    image: "Bilde",
    concept: "Forklaring",
    audio: "Audio",
  },
  contentTypes: {
    multidisciplinary: "Tverrfaglig case",
  },
  markdownEditor: {
    link: {
      url: "Lenkeadresse",
      text: "Lenketekst",
      error: {
        url: {
          empty: "Lenkeadressa kan ikkje vere tom",
          invalid: "Ugyldig lenkeadresse. Følg formatet https://ndla.no",
        },
        text: {
          empty: "Lenketeksten kan ikkje vere tom",
        },
      },
    },
    toolbar: {
      bold: {
        active: "Fjern feit skrift",
        inactive: "Legg til feit skrift",
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
    competenceGoals: "Kategoriar",
    licenseBox: "Innholdstypar",
    subjectFilter: "Fagkategoriar",
  },
  masthead: {
    search: "Søk på ndla.no",
    moreHits: "Vis fleire treff",
  },
  pagination: { next: "Neste", prev: "Forrige" },
  programmePage: {
    programmeSubjects: "Programfag",
  },
  aboutPage: {
    nav: "Informasjonsider",
  },
  subjectPage: {
    topicsTitle: "Emne i {{topic}}",
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
    title: "Sida har flytta, men du finn den her:",
    openInSubject: "Opne artikkelen i eit fag:",
  },
  forbiddenPage: {
    title: "Tilgang nekta",
    errorDescription: "Du har ikke tilgang til denne sida",
  },
};

export default messages;
