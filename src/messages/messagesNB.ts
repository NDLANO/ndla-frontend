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
    forbidden: `Tilgang nektet - ${titleTemplate}`,
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
    learningpathPage: `Mine læringsstier - ${titleTemplate}`,
    collectionPage: `Ressurser på $t(languages.{{language}}) - ${titleTemplate}`,
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
      title: "Prøv robotene våre",
      linkText: "Prøv NDLAs prateroboter",
      ingressStudent:
        "Vil du ha hjelp til å forenkle en tekst, øve til en prøve eller lage illustrasjoner? Prøv robotene våre og se om de kan hjelpe deg! I perioder med eksamensgjennomføring stenger fylkeskommunene tilgangen til robotene.",
      ingress:
        "Vil du bruke KI i undervisningen? NDLA har laget prateroboter og en bilderobot som trygt kan brukes i jobb og undervisning. I perioder med eksamensgjennomføring stenger fylkeskommunene tilgangen til robotene.",
      ingressUnauthenticated:
        "Vil du bruke KI i undervisningen? NDLA har laget prateroboter og en bilderobot som trygt kan brukes til jobb og i undervisning. Logg inn for å få tilgang til robotene.",
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
    goToMyNdla: "Gå til Min NDLA",
    learningpath: {
      newLearningpath: "Ny læringssti",
      form: {
        delete: "Slett",
        next: "Neste",
        back: "Forrige",
        deleteStep: "Slett trinn",
        deleteBody: "Innholdet kan ikke gjenopprettes",
        navigation: "Skjemanavigering",
        title: {
          titleHelper: "Gi trinnet i læringsstien en beskrivende tittel",
          imageTitle: "Bildetittel",
          copyright: "Opphav",
          metaImage: "Metabilde",
          metaImageHelper: "Legg til et bilde som representerer læringsstien din",
          noResult: "Ingen bilder treffer din søketekst",
          imageRequired: "Vennligst velg et bilde.",
        },
        content: {
          title: "Legg til innhold",
          subTitle: "Legg til innhold til læringsstien",
          resource: {
            label: "Artikkel fra NDLA",
            labelHelper: "Søk etter artikkel eller lim inn en lenke",
          },
          text: {
            title: {
              label: "Tittel",
              labelHelper: "Lag en beskrivende tittel.",
            },
            introduction: {
              label: "Ingress",
              labelHelper: "Skriv en kort ingress hvor du kort oppsummerer innholdet i trinnet ditt.",
            },
            description: {
              label: "Innhold",
              labelHelper: "Skriv eller lim inn innholdet ditt her.",
            },
          },
          external: {
            title: {
              label: "Tittel",
              labelHelper: "Lag en beskrivende tittel.",
            },
            introduction: {
              label: "Ingress",
              labelHelper: "Skriv en kort ingress hvor du kort oppsummerer innholdet i trinnet ditt.",
            },
            content: {
              label: "Innhold fra et annet nettsted",
              labelHelper: "Lim inn en lenke til innholdet du har lyst til å legge til.",
            },
            copyright:
              "Når du deler innhold fra andre nettsteder er du selv ansvarlig for at innholdet er lovlig å dele. Les mer om ",
            copyrightLink: "opphavsrett og deling.",
            checkbox: "Innholdet jeg har lenket til er lovlig å dele.",
          },
          folder: {
            label: "Søk i Mine mapper",
            labelHelper: "Velg innhold fra mappene mine",
          },
        },
        options: {
          text: "Tekst jeg har skrevet selv",
          resource: "Innhold fra NDLA",
          external: "Innhold fra et annet nettsted",
          folder: "Innhold fra en av mine mapper i Min NDLA",
        },
        steps: {
          next: "Neste: {{ next }}",
          title: "Tittel og beskrivelse",
          content: "Legg til innhold",
          preview: "Se igjennom",
          save: "Lagre og del",
          edit: "Rediger trinn",
          add: "Legg til trinn",
        },
      },
      title: "Mine læringsstier",
      description:
        "Her kan du opprette dine egne læringsstier og dele dem med elevene dine. Læringsstiene kan inneholde artikler fra NDLA, lenker til andre ressurser samt korte tekster du lager selv.",
      created: "Opprettet: {{ created }}",
      shared: "Delt: {{ shared }}",
      noPath:
        "Det ser ut til at du ikke har laget noen læringsstier. Klikk på <em>Ny</em>-knappen over for å lage en sti!",
      menu: {
        new: "Ny",
        edit: "Endre",
        delete: "Slett",
        share: "Del",
        unShare: "Avslutt deling",
        goTo: "Gå til",
        copy: "Kopier lenke",
      },
      toast: {
        deleted: 'Læringsstien "{{ name }}" er slettet.',
        unshared: 'Læringsstien "{{ name }}" er ikke lenger delt.',
        copy: 'Kopiert lenken til læringsstien "{{ name }}"',
        shared: "Læringsstien er delt.",
      },
      status: {
        shared: "Delt",
        readyForSharing: "Klar for deling",
        private: "Påbegynt",
      },
      delete: {
        title: "Slett læringssti",
        body: "Er du sikker på at du vil slette læringsstien? Handlingen kan ikke angres.",
        button: "Slett læringssti",
      },
      sharing: {
        title: "Denne læringsstien er delt",
        description: {
          shared:
            "Når du deler en læringssti, lager du ei lenke som er åpen for alle som har lenka. Du kan endre innholdet eller avslutte delinga når du ønsker det.",
          private:
            "Nå kan du dele denne lenka med elever eller andre lærere. Hvis du gjør endringer i læringsstien, blir de synlige for alle du har delt lenka med.",
          copy: "Trykk på lenka for å kopiere",
        },
        link: "Kopier lenke",
        copied: "Lenken er kopiert",
        button: {
          done: "Ferdig",
          preview: "Forhåndsvis læringssti",
        },
      },
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
      introduction: "Ingress",
      url: "Lenke",
      shareable: "Delbar",
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
  forbiddenPage: {
    title: "Tilgang nektet",
    errorDescription: "Du har ikke tilgang til denne siden.",
  },
  collectionPage: {
    title: `Ressurser på $t(languages.{{language}})`,
    noSubjects: "Vi har ikke noen ressurser på dette språket enda.",
  },
  date: {
    ago: "siden",
    now: "Akkurat nå",
    units: {
      day: "dag",
      days: "dager",
      hour: "time",
      hours: "timer",
      minute: "minutt",
      minutes: "minutter",
      month: "måned",
      months: "måneder",
      second: "sekund",
      seconds: "sekunder",
      year: "år",
      years: "år",
    },
  },
};

export default messages;
