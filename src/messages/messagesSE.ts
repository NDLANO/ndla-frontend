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
    welcomePage: `Ovdasiidu - ${titleTemplate}`,
    topicPage: "Fáddá",
    subjectsPage: `Vállje fága - ${titleTemplate}`,
    searchPage: `Oza - ${titleTemplate}`,
    notFound: `Siidu ii gávdno - ${titleTemplate}`,
    forbidden: `Tilgang nektet - ${titleTemplate}`,
    unpublished: `Ressursen er avpublisert - ${titleTemplate}`,
    accessDenied: `Ingen tilgang - ${titleTemplate}`,
    subject: "Fága",
    podcast: `Podkast - Side {{pageNumber}} - ${titleTemplate}`,
    lti: `LTI - ${titleTemplate}`,
    movedResourcePage: `Siidu lea sirdojuvvon - ${titleTemplate}`,
    myNdlaPage: `Mu NDLA - ${titleTemplate}`,
    myFoldersPage: `Mu máhpat - ${titleTemplate}`,
    myFolderPage: `{{folderName}} - ${titleTemplate}`,
    myTagPage: `#{{tag}} - ${titleTemplate}`,
    myTagsPage: `Mu lihput - ${titleTemplate}`,
    aboutPage: `{{name}} - ${titleTemplate}`,
    arenaPage: `Arena - ${titleTemplate}`,
    arenaAdminPage: `Administrer Arena - ${titleTemplate}`,
    arenaTopicPage: `{{name}} - Arena - ${titleTemplate}`,
    arenaPostPage: `{{name}} - Arena - ${titleTemplate}`,
    arenaNewTopicPage: `Ođđa reivvet - Arena - ${titleTemplate}`,
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
    episodes: "Jearahusat",
    podcast: "Podkast",
    podcasts: "Podkasttat",
    noResults: "...Eai leat oasit",
    subtitle: "Guldal ja oahpa!",
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
      title: "Geahččal min ságastallanbottu",
      linkText: "Geahččal NDLA ságastallanrobohta",
      ingressStudent:
        "Lea go dus juoga maid háliidat oahppat iežat fágas? Háliidatgo veahki teavstta álkidahttit, hárjehallat geahččalit dahje evttohit mo teavstta hábmet? Geahččal min ságastallanrobahttii ja oainnát sáhttágo dat veahkehit du!",
      ingress:
        "Áiggut go AI geavahit oahpahusas? NDLA lea ráhkadan guokte hupmanrobota mat suodjalit du priváhtavuođa ja maid sáhttá geavahit sihkkarit sihke barggus ja oahpahusas.",
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
      created: "Opprettet: {{ created }}",
      shared: "Delt: {{ shared }}",
      noPath: "Det ser ut til at du ikke har laget noen læringsstier. Klikk på <em>Ny</em> knappen for å lage en sti!",
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
        unshared: 'Lærringsstien "{{ name }}" er ikke lenger delt.',
        copy: 'Kopiert lenken til læringsstien "{{ name }}"',
        shared: "Læringsstien er delt.",
      },
      status: {
        shared: "Delt",
        ready_for_sharing: "Klar for deling",
        private: "Påbegynt",
      },
      delete: {
        title: "Slett læringssti",
        body: "Er du sikker på at du vil slette læringsstien? Handlingen kan ikke angres.",
        button: "Slett læringssti",
      },
      sharing: {
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
      name: "Namma",
      description: "Válddahus",
      title: "Namahus",
      content: "Sisdoallu",
      introduction: "Ingress",
      url: "Lenke",
      shareable: "Delbar",
    },
    required: "Dát fealta gáibiduvvo",
    requiredField: "$t(validation.fields.{{field}}) ii sáhte leat guoros",
    notUnique: "Gávdno juo",
    maxLength: "Dát fealta sáhttá sisttisdoallat eanemus {{count}} mearkkat",
    maxLengthField: "$t(validation.fields.{{field}}) sáhttá sisttisdoallat {{count}} mearkkat",
  },
  resourcepageTitles: {
    video: "Video",
    image: "Govva",
    concept: "Čilgehus",
    audio: "Jietna",
  },
  contentTypes: {
    multidisciplinary: "Fágaidrasttideaddji fáddá",
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
          empty: "Lenketeksta kan ikke være tom",
        },
      },
    },
    toolbar: {
      bold: {
        active: "Váldde eret buoiddes fontta",
        inactive: "Lasit buoiddes fontta",
      },
      italic: {
        active: "Váldde eret vinjučála fontta",
        inactive: "Lasit vinjučála fontta",
      },
      unorderedList: {
        active: "Váldde eret čuoggátávvala",
        inactive: "Lasit čuoggátávvala",
      },
      orderedList: {
        active: "Váldde eret nummáraston listtu",
        inactive: "Lasit nummárastojuvvon listtu",
      },
      link: {
        active: "Váldde eret liŋkka",
        inactive: "Lasit liŋkka",
      },
    },
  },
  tabs: {
    competenceGoals: "Kategorier",
    licenseBox: "Innholdstyper",
    subjectFilter: "Fagkategorier",
  },
  multidisciplinary: {
    casesCount: "{{count}} caser",
  },
  masthead: {
    search: "Søk på ndla.no",
    moreHits: "Vis flere treff",
  },
  pagination: { next: "Neste", prev: "Forrige" },
  programmePage: {
    programmeSubjects: "Programfag",
  },
  aboutPage: {
    nav: "Informasjonssider",
  },
  subjectPage: {
    topicsTitle: "Emner i {{topic}}",
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
    title: "Tilgang nekta",
    errorDescription: "Du har ikke tilgang til denne sida",
  },
  collectionPage: {
    title: `Ressursar på $t(languages.{{language}})`,
    noSubjects: "Vi har ikkje nokon ressursar på dette språket enda.",
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
