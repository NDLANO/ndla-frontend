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
    learningpathsPage: `Mine læringsstier - ${titleTemplate}`,
    learningpathPage: `{{name}}  - ${titleTemplate}`,
    learningpathEditStepsPage: `Rediger steg - {{name}} - Læringssti - ${titleTemplate}`,
    learningpathEditTitlePage: `Rediger tittel - {{name}} - Læringssti - ${titleTemplate}`,
    learningpathPreviewPage: `Forhåndsvis - {{name}} - Læringssti - ${titleTemplate}`,
    learningpathSavePage: `Lagre - {{name}} - Læringssti - ${titleTemplate}`,
    learningpathNewPage: `Ny Læringssti - ${titleTemplate}`,
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
      linkText: "Prøv NDLAs roboter",
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
      admin: {
        title: "Arenaen",
      },
      notification: {
        description:
          "Velkommen inn i arenaen for lærere i videregående opplæring! Dette er <em>din</em> arena: et faglig møtested for diskusjon, inspirasjon, deling og utviklende samarbeid.",
      },
      reported: "Innhold rapportert",
      error: "En feil oppstod",
      userUpdated: "Bruker oppdatert",
      accept: {
        success: "Du har nå tilgang til Arena",
        error: "Klarte ikke å godta vilkårene.",
        title: "Velkommen til arenaen",
        pitch1: "Her kan du diskutere og samarbeide med lærere fra hele Norge.",
        pitch2:
          "Her inne skal vi dele og inspirere hverandre - bare husk å respektere personvern og sørg for at alt innhold er lovlig!",
        listTitle: "Kort oppsummert:",
        list1: "Ikke del egne eller andres personvernopplysninger",
        list2: "Sørg for at det du deler er lovlig å dele.",
        list3: "Hvis du deler innhold du har skrevet selv kan andre dele det videre, så lenge de siterer deg.",
        terms: "Les mer i våre brukervilkår.",
        privacyPolicy:
          "Når du oppretter en bruker i NDLA Arena, vil vi behandle dine personopplysninger. Du kan lese mer om vår behandling av personopplysninger i ",
        privacyPolicyLink: "vår personvernerklæring.",
        acceptButton: "Godta",
      },
    },
    goToMyNdla: "Gå til Min NDLA",
    learningpath: {
      newLearningpath: "Ny læringssti",
      editLearningpath: "Rediger læringssti",
      editLearningpathTitle: "Rediger tittel på læringssti",
      form: {
        delete: "Slett",
        next: "Neste",
        back: "Forrige",
        deleteStep: "Slett steg",
        deleteBody: "Innholdet kan ikke gjenopprettes",
        navigation: "Skjemanavigering",
        title: {
          titleHelper: "Gi steget i læringsstien en beskrivende tittel",
          imageTitle: "Bildetittel",
          copyright: "Opphav",
          metaImage: "Metabilde",
          metaImageHelper: "Legg til et bilde som representerer læringsstien din",
          noResult: "Ingen bilder treffer søketeksten din",
          imageRequired: "Vennligst velg et bilde.",
        },
        content: {
          title: "Legg til innhold",
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
              labelHelper: "Skriv en kort ingress hvor du oppsummerer innholdet i steget ditt.",
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
              labelHelper: "Skriv en kort ingress hvor du oppsummerer innholdet i steget ditt.",
            },
            content: {
              label: "Innhold fra et annet nettsted",
              labelHelper: "Lim inn en lenke til innholdet du har lyst til å legge til.",
            },
            copyright:
              "Når du deler innhold fra andre nettsteder, er du selv ansvarlig for at innholdet er lovlig å dele. Les mer om ",
            copyrightLink: "opphavsrett og deling.",
            checkbox: "Innholdet jeg har lenket til, er lovlig å dele.",
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
          preview: "Se gjennom",
          save: "Lagre og del",
          edit: "Rediger steg",
          add: "Legg til steg",
        },
      },
      title: "Mine læringsstier",
      description:
        "Her kan du opprette dine egne læringsstier og dele dem med elevene dine. Læringsstiene kan inneholde artikler fra NDLA, lenker til andre ressurser og korte tekster du lager selv.",
      created: "Opprettet: {{ created }}",
      shared: "Delt: {{ shared }}",
      noPath:
        "Det ser ikke ut til at du har laget noen læringsstier. Klikk på <em>Ny</em>-knappen over for å lage en sti!",
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
        unshareFailed: "Kunne ikke avslutte deling av læringsstien.",
        copy: 'Kopiert lenken til læringsstien "{{ name }}"',
        shared: "Læringsstien er delt.",
        shareFailed: "Kunne ikke dele læringsstien.",
      },
      status: {
        shared: "Delt",
        readyForSharing: "Klar for deling",
        private: "Påbegynt",
      },
      delete: {
        title: "Slett læringssti",
        body: "Er du sikker på at du vil slette læringsstien? Den kan ikke gjenopprettes.",
        button: "Slett læringssti",
      },
      sharing: {
        title: "Denne læringsstien er delt",
        description: {
          shared:
            "Når du deler en læringssti, lager du en lenke som er åpen for alle som har lenken. Du kan endre innholdet eller avslutte delinga når du ønsker det.",
          private:
            "Nå kan du dele denne lenken med elever eller andre lærere. Hvis du gjør endringer i læringsstien, blir de synlige for alle du har delt lenken med.",
          copy: "Trykk på lenken for å kopiere",
        },
        link: "Kopier lenke",
        copied: "Lenken er kopiert",
        button: {
          done: "Ferdig",
          preview: "Forhåndsvis læringssti",
        },
      },
      saveLearningpath: {
        saveAndClose: "Lagre og lukk",
        pageHeading: "Lagre og del",
        pageDescription:
          "Lagre og del læringsstien din. Når du deler, oppretter du en lenke som du kan sende til elever eller andre lærere.",
      },
      previewLearningpath: {
        pageHeading: "Se gjennom",
        pageDescription: "Se gjennom læringsstien du har laget.",
        noSteps: "Du har ikke lagt til steg i læringsstien ennå.",
      },
      copy: {
        title: "Kopier læringssti",
        description:
          "Ved å kopiere en læringssti, legges den til i listen over dine læringsstier. Du kan deretter redigere og tilpasse stien slik du ønsker.",
        button: "Kopier til mine læringsstier",
        success: "Læringsstien er kopiert",
        error: "Noe gikk galt ved kopiering av læringsstien",
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
    maxLength: "Dette feltet kan inneholde maks {{count}} tegn",
    maxLengthField: "$t(validation.fields.{{field}}) kan innholde maks {{count}} tegn",
  },
  lti: {
    goBack: "Tilbake til LTI-søk",
  },
  resourcepageTitles: {
    video: "Video",
    image: "Bilde",
    audio: "Lyd",
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
        active: "Fjern kursiv skrift",
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
    externalWarning:
      "Denne læringsstien er utarbeidet av en ekstern lærer, som har det redaksjonelle ansvaret. Vær oppmerksom på at den kan inneholde tekster og lenker som ikke kommer fra ndla.no.",
    externalLink: "Åpne i nytt vindu",
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
