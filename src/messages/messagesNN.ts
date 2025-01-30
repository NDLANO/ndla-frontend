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
    forbidden: `Tilgang nekta - ${titleTemplate}`,
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
    learningpathsPage: `Mine læringsstiar - ${titleTemplate}`,
    learningpathPage: `{{name}}  - ${titleTemplate}`,
    learningpathEditStepsPage: `Rediger steg - {{name}} - Læringssti - ${titleTemplate}`,
    learningpathEditTitlePage: `Rediger tittel - {{name}} - Læringssti - ${titleTemplate}`,
    learningpathPreviewPage: `Førehandsvis - {{name}} - Læringssti - ${titleTemplate}`,
    learningpathSavePage: `Lagre - {{name}} - Læringssti - ${titleTemplate}`,
    learningpathNewPage: `Ny læringssti - ${titleTemplate}`,
    collectionPage: `Ressursar på $t(languages.{{language}}) - ${titleTemplate}`,
  },
  menu: {
    about: "Om oss",
    subjectAndProgramme: "Fag og utdanningsprogram",
    tipsAndAdvice: "Tips og råd",
    goBack: "Gå tilbake",
  },
  podcastPage: {
    meta: "Lytt og lær! NDLA har meir enn 100 fritt tilgjengelege podkastar for engasjerande bruk i vidaregåande opplæring.",
    episodes: "Episodar",
    podcast: "Podkast",
    podcasts: "Podkastar",
    noResults: "... Ingen episodar",
    subtitle: "Lytt og lær!",
    pagination: "Podkastsider",
  },
  subjectsPage: { tabFilter: { label: "Kva fag vil du vise?", all: "Alle fag og ressursar" } },
  searchPage: {
    title: "Søk på ndla.no",
    filterSearch: "Filtrer søket ditt:",
    subjectLetter: "Fag som startar på {{letter}}",
    resourceTypeFilter: "Ressurstypar",
  },
  myndla: {
    tagsTitle: "Mine emneknaggar",
    campaignBlock: {
      title: "Prøv robotane våre",
      linkText: "Prøv robotane våre",
      ingressStudent:
        "Vil du ha hjelp til å forenkle ein tekst, øve til ein prøve eller lage illustrasjonar? Prøv robotane våre og sjå om dei kan hjelpe deg! I periodar med eksamensgjennomføring stenger fylkeskommunane tilgangen til robotane.",
      ingress:
        "Vil du bruke KI i undervisninga? NDLA har laga praterobotar og ein biletrobot som trygt kan brukast i jobb og undervisning. I periodar med eksamensgjennomføring stenger fylkeskommunane tilgangen til robotane.",
      ingressUnauthenticated:
        "Vil du bruke KI i undervisninga? NDLA har laga praterobotar og ein biletrobot som trygt kan brukast til jobb og i undervisning. Logg inn for å få tilgang til robotane.",
    },
    resource: {
      addedToFolder: 'Ressurs er lagt i "{{folder}}"',
      added: "Lagt til",
      removed: "Fjerna",
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
      userUpdated: "Brukar oppdatert",
      accept: {
        success: "Du har no tilgang til Arena",
        error: "Klarte ikkje å godta vilkåra.",
        title: "Velkommen til arenaen",
        pitch1: "Her kan du diskutere og samarbeide med lærarar frå heile Noreg.",
        pitch2:
          "Her inne skal vi dele og inspirere kvarandre - berre hugs å respektere personvern og sørg for at alt innhald er lovleg!",
        listTitle: "Kort oppsummert:",
        list1: "Ikkje del eigne eller andres personvernopplysingar",
        list2: "Sørg for at det du deler er lovleg å dele.",
        list3: "Om du deler innhald du har skrive sjølv kan andre dele det vidare, så lenge dei siterer deg.",
        terms: "Les meir i våre brukervilkår.",
        privacyPolicy:
          "Når du opprettar ein bruker i NDLA Arena, vil vi behandle dine personopplysingar. Du kan lese meir om vår handsaming av personvernopplysingar i ",
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
        back: "Førre",
        deleteStep: "Slett trinn",
        deleteBody: "Innhaldet kan ikkje gjenopprettast",
        navigation: "Skjemanavigering",
        title: {
          titleHelper: "Skriv ein beskrivande tittel for dette steget i læringsstien.",
          imageTitle: "Bilettittel",
          copyright: "Opphav",
          metaImage: "Metabilete",
          metaImageHelper: "Legg til eit bilete som representerer læringsstien din",
          noResult: "Ingen søketreff for bilete",
          imageRequired: "Ver vennleg å velje eit bilete.",
        },
        content: {
          title: "Legg til innhald",
          resource: {
            label: "Artikkel frå NDLA",
            labelHelper: "Søk etter artikkel eller lim inn ei lenke",
          },
          text: {
            title: {
              label: "Tittel",
              labelHelper: "Lag ein beskrivande tittel.",
            },
            introduction: {
              label: "Ingress",
              labelHelper: "Skriv ein kort ingress der du oppsummerer innhaldet i steget ditt.",
            },
            description: {
              label: "Innhald",
              labelHelper: "Skriv eller lim inn innhaldet ditt her.",
            },
          },
          external: {
            title: {
              label: "Tittel",
              labelHelper: "Lag ein beskrivande tittel.",
            },
            introduction: {
              label: "Ingress",
              labelHelper: "Skriv ein kort ingress der du oppsummerer innhaldet i steget ditt.",
            },
            content: {
              label: "Innhald frå ein annan nettstad",
              labelHelper: "Lim inn ei lenke til innhaldet du vil legge til.",
            },
            copyright:
              "Når du deler innhald frå andre nettstader, er du sjølv ansvarleg for at innhaldet er lovleg å dele. Les meir om ",
            copyrightLink: "opphavsrett og deling.",
            checkbox: "Innhaldet eg har lenka til, er lovleg å dele.",
          },
          folder: {
            label: "Søk i Mine mapper",
            labelHelper: "Vel innhald frå mine mapper",
          },
        },
        options: {
          text: "Tekst eg har skrive sjølv",
          resource: "Innhald frå NDLA",
          external: "Innhald frå ein annan nettstad",
          folder: "Innhald frå ei av mine mapper i Min NDLA",
        },
        steps: {
          next: "Neste: {{ next }}",
          title: "Tittel og beskriving",
          content: "Legg til innhald",
          preview: "Sjå gjennom",
          save: "Lagre og del",
          edit: "Rediger trinn",
          add: "Legg til trinn",
        },
      },
      title: "Mine læringsstiar",
      description:
        "Her kan du lage dine eigne læringsstiar og dele dei med elevane dine. Læringsstiane kan innehalde artiklar frå NDLA, lenker til andre ressursar og korte tekstar du lagar sjølv.",
      created: "Oppretta: {{ created }}",
      shared: "Delt {{ shared }}",
      noPath:
        "Det ser ikkje ut til at du har laga nokon læringsstiar. Klikk på <em>Ny</em>-knappen over for å lage ein sti!",
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
        deleted: 'Læringsstien "{{ name }}" er sletta.',
        unshared: 'Læringsstien "{{ name }}" er ikkje lenger delt.',
        unshareFailed: "Kunne ikkje avslutte delinga av læringsstien.",
        copy: 'Kopierte lenka til læringsstien "{{ name }}"',
        shared: "Læringsstien er delt.",
        shareFailed: "Kunne ikkje dele læringsstien.",
      },
      status: {
        shared: "Delt",
        readyForSharing: "Klar for deling",
        private: "Starta",
      },
      delete: {
        title: "Slett læringssti",
        body: "Er du sikker på at du vil slette læringsstien? Stien kan ikkje gjenopprettast.",
        button: "Slett læringssti",
      },
      sharing: {
        title: "Denne læringsstien er delt",
        description: {
          shared:
            "Når du deler ein læringssti, lagar du ei lenke som er open for alle som har lenka. Du kan endre innhaldet eller avslutte delinga når du ønsker det.",
          private:
            "No kan du dele denne lenka med elevar eller andre lærarar. Dersom du gjer endringar i læringsstien, blir dei synlege for alle du har delt lenka med.",
          copy: "Trykk på lenka for å kopiere",
        },
        link: "Kopier lenke",
        copied: "Lenka er kopiert",
        button: {
          done: "Ferdig",
          preview: "Førehandsvis læringssti",
        },
      },
      saveLearningpath: {
        saveAndClose: "Lagre og lukk",
        pageHeading: "Lagre og del",
        pageDescription:
          "Lagre og del læringstien din. Når du deler, blir det laga ei lenke du kan sende til elevar eller andre lærarar.",
      },
      previewLearningpath: {
        pageHeading: "Sjå gjennom",
        pageDescription: "Sjå gjennom læringsstien du har laga.",
        noSteps: "Du har ikkje lagt til nokon steg i læringsstien enno.",
      },
    },
  },
  ndlaFilm: {
    films: "Filmar",
    topics: "Emne",
    filterFilms: "Filtrer filmar",
  },
  validation: {
    fields: {
      name: "Namn",
      title: "Tittel",
      content: "Innhald",
      description: "Beskriving",
      introduction: "Ingress",
      url: "Lenka",
      shareable: "Delbar",
    },
    required: "Dette feltet er påkravd",
    requiredField: "$t(validation.fields.{{field}}) kan ikkje vere tom",
    notUnique: "Finst allereie",
    maxLength: "Dette feltet kan innehalde maks {{count}} teikn",
    maxLengthField: "$t(validation.fields.{{field}}) kan innehalde maks {{count}} teikn",
  },
  lti: {
    goBack: "Tilbake til LTI-søk",
  },
  resourcepageTitles: {
    video: "Video",
    image: "Bilete",
    concept: "Forklaring",
    audio: "Audio",
  },
  contentTypes: {
    multidisciplinary: "Tverrfagleg case",
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
    licenseBox: "Innhaldstypar",
    subjectFilter: "Fagkategoriar",
  },
  masthead: {
    search: "Søk på ndla.no",
    moreHits: "Vis fleire treff",
  },
  pagination: { next: "Neste", prev: "Førre" },
  programmePage: {
    programmeSubjects: "Programfag",
  },
  aboutPage: {
    nav: "Informasjonssider",
  },
  subjectPage: {
    topicsTitle: "Emne i {{topic}}",
  },
  welcomePage: {
    programmes: "Utdanningsprogram",
  },
  learningpathPage: {
    accordionTitle: "Innhald i læringssti",
    learningsteps: "Læringssteg",
    stepCompleted: "Fullført",
    externalWarning:
      "Denne læringsstien er utarbeidd av ein ekstern lærar, som har det redaksjonelle ansvaret. Ver merksam på at ho kan innehalde tekstar og lenkjer som ikkje kjem frå ndla.no.",
    externalLink: "Åpne i nytt vindauge",
  },
  movedResourcePage: {
    title: "Sida har flytta, men du finn ho her:",
    openInSubject: "Opne artikkelen i eit fag:",
  },
  forbiddenPage: {
    title: "Tilgang nekta",
    errorDescription: "Du har ikkje tilgang til denne sida",
  },
  collectionPage: {
    title: `Ressursar på $t(languages.{{language}})`,
    noSubjects: "Vi har ikkje nokon ressursar på dette språket enno.",
  },
  date: {
    ago: "sidan",
    now: "Akkurat no",
    units: {
      day: "dag",
      days: "dagar",
      hour: "time",
      hours: "timar",
      minute: "minutt",
      minutes: "minutt",
      month: "månad",
      months: "månader",
      second: "sekund",
      seconds: "sekund",
      year: "år",
      years: "år",
    },
  },
};

export default messages;
