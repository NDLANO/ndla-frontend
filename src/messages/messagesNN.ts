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
    learningpathNewPage: `Ny Læringssti - ${titleTemplate}`,
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
    goToMyNdla: "Gå til Min NDLA",
    learningpath: {
      newLearningpath: "Ny læringssti",
      editLearningpath: "Rediger læringssti",
      editLearningpathTitle: "Rediger læringssti tittel",
      form: {
        delete: "Slett",
        next: "Neste",
        back: "Forrige",
        deleteStep: "Slett trinn",
        deleteBody: "Innholdet kan ikkje gjenopprettast",
        navigation: "Skjemanavigering",
        title: {
          titleHelper: "Gi trinnet i læringsstien en beskrivende tittel",
          imageTitle: "Bildetittel",
          copyright: "Opphav",
          metaImage: "Metabilde",
          metaImageHelper: "Legg til et bilde som representerer læringsstien din",
          noResult: "Ingen bildar treffar din søketekst",
          imageRequired: "Vennligst velg eit bilete.",
        },
        content: {
          title: "Legg til innhald",
          subTitle: "Legg til innhald til læringsstien",
          resource: {
            label: "Artikkel frå NDLA",
            labelHelper: "Søk etter artikkel eller lim inn ein lenke",
          },
          text: {
            title: {
              label: "Tittel",
              labelHelper: "Lag ei beskrivande tittel.",
            },
            introduction: {
              label: "Ingress",
              labelHelper: "Skriv ein kort ingress der du kort oppsummerer innhaldet i steget ditt.",
            },
            description: {
              label: "Innhald",
              labelHelper: "Skriv eller lim inn innhaldet ditt her.",
            },
          },
          external: {
            title: {
              label: "Tittel",
              labelHelper: "Lag ei beskrivande tittel.",
            },
            introduction: {
              label: "Ingress",
              labelHelper: "Skriv ein kort ingress der du kort oppsummerer innhaldet i steget ditt.",
            },
            content: {
              label: "Innhald frå eit anna nettstad",
              labelHelper: "Lim inn ein lenke til innhaldet du vil legge til.",
            },
            copyright:
              "Når du deler innhald frå andre nettstader er du sjølv ansvarleg for at innhaldet er lovleg å dele. Les meir om ",
            copyrightLink: "opphavsrett og deling.",
            checkbox: "Inhaldet eg har lenka til er lovleg å dele.",
          },
          folder: {
            label: "Søk i Mine mapper",
            labelHelper: "Velg innhald frå mine mapper",
          },
        },
        options: {
          text: "Tekst eg har skrevet sjølv",
          resource: "Innhald frå NDLA",
          external: "Innhald frå eit anna nettstad",
          folder: "Innhald frå ein av mine mapper i Min NDLA",
        },
        steps: {
          next: "Neste: {{ next }}",
          title: "Tittel og beskrivelse",
          content: "Legg til innhald",
          preview: "Sjå igjennom",
          save: "Lagre og del",
          edit: "Rediger trinn",
          add: "Legg til trinn",
        },
      },
      title: "Mine læringsstiar",
      description:
        "Her kan du lage dine eigne læringsstiar og dele dei med elevane dine. Læringsstiane kan innehalde artiklar frå NDLA, lenker til andre ressursar samt korte tekstar du lagar sjølv.",
      created: "Oppretta: {{ created }}",
      shared: "Delt {{ shared }}",
      noPath:
        "Det ser ut til at du ikkje har laga nokon læringsstiar. Klikk på <em>Ny</em>-knappen over for å lage ein sti!",
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
        body: "Er du sikker på at du vil slette læringsstien? Handlinga kan ikkje angrast.",
        button: "Slett læringssti",
      },
      sharing: {
        title: "Denne læringsstien er delt",
        description: {
          shared:
            "Når du deler ein læringssti, lagar du ei lenke som er open for alle som har lenka. Du kan endre innhaldet eller avslutte delinga når du ønskjer det.",
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
          "Lagre og del læringstien din. Når du deler opprettar du ein delbar lenke som du kan sende til elevar eller lærarar.",
      },
      previewLearningpath: {
        pageHeading: "Sjå igjennom",
        pageDescription: "Sjå igjennom læringsstien du har laga.",
        noSteps: "Du har ikkje lagt til nokon steg i læringsstien enno.",
      },
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
      introduction: "Ingress",
      url: "Lenka",
      shareable: "Delbar",
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
    errorDescription: "Du har ikkje tilgang til denne sida",
  },
  collectionPage: {
    title: `Ressursar på $t(languages.{{language}})`,
    noSubjects: "Vi har ikkje nokon ressursar på dette språket enda.",
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
