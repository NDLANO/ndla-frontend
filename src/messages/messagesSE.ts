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
  myNdla: {
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
      added: "Lagt til",
      removed: "Fjernet",
      showTags: "Vis emneknagger",
      tagsDialogTitle: "Emneknagger knyttet til ressurs {{title}}",
      noTags: "Ingen emneknagger.",
    },
    sharedFolder: {
      learningpathUnsupportedTitle: "Læringsstier støttes ikke",
      resourceRemovedTitle: "Ressurs ikke tilgjengelig",
    },
    acceptedShareName: {
      title: "Nå viser vi navnet ditt når du deler",
      subtitle: "Vi har endret visningen på delte mapper. Nå vises navnet ditt på alle delte mapper og læringsstier.",
      description:
        "Dersom du ikke ønsker at navnet ditt skal være synlig kan du avslutte deling av mapper og læringsstier.",
      button: "OK",
      accept: {
        error: "Kunne ikke lagre",
      },
    },
    arena: {
      title: "Arenaen",
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
      editLearningpathTitle: "Rediger læringsstitittel",
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
          imageRequired: "Vennligst velg eit bilete.",
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
              labelHelper: "Skriv en kort ingress hvor du kort oppsummerer innholdet i trinnet ditt.",
            },
            description: {
              label: "Innhold",
              labelHelper: "Skriv eller lim inn innholdet ditt her.",
            },
            copyright:
              "Det du deler i en læringssti blir tilgjengelig under en Creative Commons-lisens (BY-SA). Dette betyr at andre kan bruke og dele det du har laget, så lenge de gir deg kreditering.",
            copyrightLink: "Les mer om NDLA og deling av innhold her",
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
            labelHelper: "Velg innhold fra mappene dine",
            placeholder: "Søk etter ressurser som ligger i dine mapper",
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
          title: "Tittel og metabilde",
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
        unshareFailed: "Kunne ikke avslutte deling av læringsstien.",
        copy: 'Kopiert lenken til læringsstien "{{ name }}"',
        shared: "Læringsstien er delt.",
        shareFailed: "Kunne ikke dele læringsstien.",
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
      saveLearningpath: {
        saveAndClose: "Lagre og lukk",
        pageHeading: "Lagre og del",
        pageDescription:
          "Lagre og del læringsstien din. Når du deler oppretter du en delbar lenke som du kan sende til elever eller lærere.",
      },
      previewLearningpath: {
        pageHeading: "Preview",
        pageDescription: "Preview the learning path you have created.",
        noSteps: "You haven't added any steps to the learning path yet.",
      },
      copy: {
        title: "Kopier læringssti",
        description:
          "Ved å kopiere en læringssti, legges den til i listen over dine læringsstier. Du kan deretter redigere og tilpasse stien slik du ønsker.",
        button: "Kopier til mine læringsstier",
        success: { title: "Kopiert", description: "Læringsstien er kopiert til " },
        error: "Noe gikk galt ved kopiering av læringsstien",
        loginCopyPitch: "Ønsker du å kopiere denne læringsstien?",
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
    properUrl: "Dette feltet kan kun innholde en gyldig lenke. Eks: https://ndla.no",
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
    externalWarning:
      "Denne læringsstien er utarbeidet av en ekstern lærer, som har det redaksjonelle ansvaret. Vær oppmerksom på at den kan inneholde tekster og lenker som ikke kommer fra ndla.no.",
    externalLink: "Åpne i nytt vindu",
    bylineSuffix:
      "Forfatteren har redaksjonelt ansvar for denne læringsstien. Vær oppmerksom på at den kan inneholde tekster og lenker som ikke kommer fra ndla.no.",
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
  richTextEditor: {
    plugin: {
      link: {
        edit: "Rediger lenke",
        create: "Opprett lenke",
        popoverTitle: "Lenke til {{domain}}",
        form: {
          textLabel: "Tekst",
          urlLabel: "URL",
        },
      },
    },
  },
};

export default messages;
