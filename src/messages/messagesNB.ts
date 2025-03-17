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
  subjectsPage: {
    tabFilter: {
      label: "Hvilke fag vil du vise?",
      all: "Alle fag og ressurser",
    },
    myFavoriteSubjects: "Dine favorittfag",
    subjectGroup: 'Gruppe "{{ category }}"',
    scrollToGroup: "Hopp til gruppe",
    errorDescription: "Beklager, en feil oppstod under lasting av fagene.",
    allSubjects: "Alle fag",
    alphabeticSort: "Fag gruppert alfabetisk",
    addConfirmed: "{{subject}} er lagt til som favorittfag",
    removeConfirmed: "{{subject}} er fjernet fra favorittfag",
    addFavorite: "Legg til favorittfag",
    removeFavorite: "Fjern favorittfag",
    confirmRemove: "Er du sikker på at du vil fjerne {{subject}} fra favorittfag?",
    subjectFavoritePitch: "Ønsker du å favorittmerke dette faget?",
    subjectFavoriteGuide:
      "For å favorittmerke et fag må du logge inn på Min NDLA. Du finner faget øverst på denne siden etter at du har logget inn.",
  },
  topicsPage: {
    topics: "Emner",
  },
  searchPage: {
    title: "Søk på ndla.no",
    filterSearch: "Filtrer søket ditt:",
    subjectLetter: "Fag som starter på {{letter}}",
    resourceTypeFilter: "Ressurstyper",
    noHits: "Ingen artikler samsvarte med søket ditt på: {{query}}",
    noHitsShort: "Ingen treff på søk: {{query}}",
    removeFilterSuggestion: "Prøv å fjerne filter",
    search: "Søk",
    close: "Lukk",
    abilities: "Egenskaper",
    searchFieldPlaceholder: "Søk i fagstoff, oppgaver og aktiviteter eller læringsstier",
    searchFieldPlaceholderShort: "Søk",
    label: {
      subjects: "Fag:",
    },
    includes: "Inneholder:",
    searchField: {
      contentTypeResultShowMoreLabel: "Se flere resultater",
      contentTypeResultShowLessLabel: "Se færre resultater",
      allResultButtonText: "Vis alle søketreff",
      searchResultHeading: "Forslag:",
      contentTypeResultNoHit: "Ingen treff på søk ...",
    },
    searchResultListMessages: {
      subjectsLabel: "Åpne i fag:",
      noResultHeading: "Hmm, ikke noe innhold ...",
      noResultDescription:
        "Vi har dessverre ikke noe å tilby her. Hvis du vil foreslå noe innhold til dette området, kan du bruke Spør NDLA som du finner nede til høyre på skjermen.",
    },
    searchFilterMessages: {
      backButton: "Tilbake til filter",
      filterLabel: "Filtrer søket",
      confirmButton: "Oppdater filter",
      hasValuesButtonText: "Flere fag",
      noValuesButtonText: "Filtrer på fag",
      useFilter: "Bruk filter",
      closeFilter: "Lukk filter",
      removeFilter: "Fjern filter {{filterName}}",
      additionalSubjectFilters: "+ {{count}} fag",
      coreRelevance: "Kjernestoff",
      supplementaryRelevance: "Tilleggsstoff",
      resourceTypeFilter: {
        heading: "Filtrer på innholdstype",
        button: "Filtrer på innholdstype",
      },
    },
    resultType: {
      showing: "Viser {{count}} av {{totalCount}} {{contentType}}",
      showingAll: "Viser alle",
      showMore: "Vis mer",
      showAll: "Vis alle",
      toTopOfPage: "Til toppen",
      toSubjectPageLabel: "Gå til fagsiden",
      all: "Alle",
      allContentTypes: "Alle innholdstyper",
      hits: "{{count}} treff",
      showingSearchPhrase: "Viser treff for",
      showingCompetenceGoalSearchPhrase: "Viser resultater for kompetansemål {text}",
      searchPhraseSuggestion: "Søk heller",
      notionLabels: "Brukes i",
      notionsHeading: "Begrepsforklaring",
      notionsRemove: "Fjern",
      showVideo: "Se video",
      concept: "Begrepsforklaring",
      gloss: "Glose",
      gridView: "Gallerivisning",
      listView: "Listevisning",
    },
    contextModal: {
      button: "+ {{count}} flere steder",
      heading: "Ressursen er brukt flere steder",
      ariaLabel: "Se flere kontekster",
    },
  },
  myNdla: {
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
      added: "Lagt til",
      addedFailed: "Klarte ikke å legge til ressursen",
      removed: "Fjernet",
      showTags: "Vis emneknagger",
      tagsDialogTitle: "Emneknagger knyttet til ressurs {{title}}",
      noTags: "Ingen emneknagger.",
      add: "Legg til mappe/emneknagg",
      remove: "Fjern",
      removeTitle: "Fjern ressurs",
      confirmRemove: "Er du sikker på at du ønsker å fjerne ressursen fra denne mappen?",
      copyLink: "Kopier lenke til siden",
      linkCopied: "Kopiert til utklippstavle",
      addToMyNdla: "Legg i Min NDLA",
      addedToMyNdla: "Lagt i Min NDLA",
      copyToMyNdla: "Kopier til Min NDLA",
      addedToFolder: "Ressurs er lagt i ",
      removedFromFolder: 'Fjernet fra "{{folderName}}"',
      removedFromFolderFailed: 'Klarte ikke å fjerne ressurs fra "{{folderName}}"',
      titleUpdated: "Tittel oppdatert",
      tagsUpdated: "Emneknagger oppdatert",
      tagsUpdatedFailed: "Klarte ikke å oppdatere emneknagger",
      show: "Vis",
      save: "Lagre ressurs",
      onDragStart: "Plukket opp ressursen {{name}}. Ressursen er på posisjon {{index}} av {{length}}",
      onDragOver: "Ressursen {{name}} ble flyttet til posisjon {{index}} av {{length}}",
      onDragOverMissingOver: "Ressursen {{name}} er ikke lenger over et slippbart område",
      onDragEnd: "Ressursen {{name}} ble sluppet på posisjon {{index}} av {{length}}",
      onDragEndMissingOver: "Ressursen {{name}} ble sluppet",
      onDragCancel: "Flytting avbrutt. Ressursen {{name}} ble sluppet",
      dragHandle: "Sorter ressursen {{name}}",
    },
    sharedFolder: {
      learningpathUnsupportedTitle: "Læringsstier støttes ikke",
      resourceRemovedTitle: "Ressurs ikke tilgjengelig",
      folderCopied: "Mappen har blitt kopiert.",
      info: "Denne mappa inneholder fagstoff og oppgaver fra NDLA, samlet av {{shared}}.",
      shared: "Denne mappa inneholder fagstoff og oppgaver fra NDLA, samlet av {{sharedBy}}.",
      aTeacher: "en lærer",
      firstShared: "Mappa ble delt første gang {{date}}",
      learningpathUnsupported:
        "Læringsstier og tverrfaglige caser kan ikke vises direkte i delte mapper. Dersom du trykker på lenka i navigasjonsmenyen til venstre, vil stien åpnes i en ny fane.",
      drawerButton: "Vis mapper og ressurser",
      drawerTitle: "Mapper og ressurser",
      description:
        "I denne delte mappa finner du fagstoff og oppgaver fra NDLA. Artiklene er samlet inn og satt i rekkefølge av en lærer.",
      willOpenInNewTab: "Åpnes i ny fane.",
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
    learningpathstep: {
      onDragStart: "Plukket opp læringsstisteget {{name}}. Læringsstisteget er på posisjon {{index}} av {{length}}",
      onDragOver: "Læringsstisteget {{name}} ble flyttet til posisjon {{index}} av {{length}}",
      onDragOverMissingOver: "Læringsstisteget {{name}} er ikke lenger over et slippbart område",
      onDragEnd: "Læringsstisteget {{name}} ble sluppet på posisjon {{index}} av {{length}}",
      onDragEndMissingOver: "Læringsstisteget {{name}} ble sluppet",
      onDragCancel: "Flytting avbrutt. Læringsstisteget {{name}} ble sluppet",
      dragHandle: "Sorter læringsstisteg {{name}}",
      error: "Noe gikk galt ved flytting av læringsstisteget",
    },
    learningpath: {
      newLearningpath: "Ny læringssti",
      editLearningpath: "Rediger læringssti",
      editLearningpathTitle: "Rediger tittel på læringssti",
      form: {
        delete: "Slett",
        next: "Gå videre",
        back: "Forrige",
        deleteStep: "Slett steg",
        deleteBody: "Innholdet kan ikke gjenopprettes",
        navigation: "Skjemanavigering",
        title: {
          titleHelper: "Gi læringsstien en beskrivende tittel",
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
            labelHelper: "Søk etter artikkel",
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
            copyright:
              "Alt du skriver i en læringssti på NDLA blir publisert under lisensen CC BY-SA. Dette betyr at andre kan bruke, tilpasse og bygge videre på arbeidet ditt, så lenge de gir deg kreditering.",
            copyrightLink: "Les mer om NDLA og deling av innhold her",
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
            noResources: "Du har ikke lagt til noen ressurser i mappene dine ennå.",
            label: "Søk i Mine mapper",
            labelHelper: "Velg innhold fra mappene dine",
            placeholder: "Søk etter ressurser som ligger i dine mapper",
            error: "Noe gikk galt ved henting av ressurser",
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
          title: "Tittel",
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
        createdFailed: "Klarte ikke opprette læringssti.",
        deleted: 'Læringsstien "{{ name }}" er slettet.',
        deletedFailed: 'Kunne ikke slette læringstien "{{ name }}".',
        unshared: 'Læringsstien "{{ name }}" er ikke lenger delt.',
        unshareFailed: "Kunne ikke avslutte deling av læringsstien.",
        copy: 'Kopiert lenken til læringsstien "{{ name }}".',
        shared: "Læringsstien er delt.",
        shareFailed: "Kunne ikke dele læringsstien.",
        createdStep: 'Et steg med tittel "{{ name }}" ble opprettet.',
        deletedStep: 'Et steg med tittel "{{ name }}" ble slettet.',
        deletedStepFailed: 'Kunne ikke slette steget med tittel "{{ name }}".',
        createdStepFailed: 'Kunne ikke opprette steg med tittel "{{ name }}".',
        updateStepFailed: 'Kunne ikke oppdatere steget med tittel "{{ name }}".',
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
          "Lagre og del læringsstien din. Når du deler oppretter du en delbar lenke som du kan sende til elever eller lærere.",
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
        success: { title: "Kopiert", description: "Læringsstien er kopiert til " },
        error: "Noe gikk galt ved kopiering av læringsstien",
        loginCopyPitch: "Ønsker du å kopiere denne læringsstien?",
      },
    },
    description:
      "Min NDLA: Organiser fagstoffet på din måte! Bruk NDLAs praterobot (AI/KI). Lagre og del med kolleger og elever.",
    mainMenu: "Hovedmeny",
    myNDLA: "Min NDLA",
    myNDLAMenu: "Min NDLA meny",
    support: "Brukerstøtte",
    resources_one: "{{count}} ressurs",
    resources_other: "{{count}} ressurser",
    folders_one: "{{count}} mappe",
    folders_other: "{{count}} mapper",
    settings: "Innstillinger",
    showEditOptions: "Vis redigeringsmuligheter",
    folder: {
      folder: "Mappe",
      navigation: "Mappenavigasjon",
      delete: "Slett mappe",
      deleteShort: "Slett",
      edit: "Rediger mappe",
      editShort: "Rediger",
      copy: "Kopier mappe",
      open: "Åpne mappe",
      close: "Lukk mappe",
      updated: "Mappen har blitt oppdatert",
      updatedFailed: "Klarte ikke å oppdatere mappen",
      defaultPageDescription: "Legg til beskrivelse ved å redigere mappen",
      missingName: "Skriv navn på mappe",
      folderDeleted: '"{{folderName}}" er slettet',
      folderDeletedFailed: 'Klarte ikke å slette "{{folderName}}"',
      folderCreated: '"{{folderName}}" er opprettet',
      folderCreatedFailed: 'Klarte ikke å opprette "{{folderName}}"',
      onDragStart: "Plukket opp mappen {{name}}. Mappen er på posisjon {{index}} av {{length}}",
      onDragOver: "Mappen {{name}} ble flyttet til posisjon {{index}} av {{length}}",
      onDragOverMissingOver: "Mappen {{name}} er ikke lenger over et slippbart område",
      onDragEnd: "Mappen {{name}} ble sluppet på posisjon {{index}} av {{length}}",
      onDragEndMissingOver: "Mappen {{name}} ble sluppet",
      onDragCancel: "Flytting avbrutt. Mappen {{name}} ble sluppet",
      dragHandle: "Sorter mappen {{name}}",
      professional: "en fagperson",
      sharedWarning: "Navn og beskrivelse blir synlig for alle du deler mappen med.",
      sharing: {
        share: "Del mappe",
        shared: "Delt",
        sharedBy: "Delt av ",
        sharedByAnonymous: "anonym lærer",
        sharedFolder: "Delt mappe",
        unShare: "Delingen er avsluttet. Mappen er ikke lenger delt.",
        unShareFailed: "Klarte ikke å avslutte delingen. Mappen er ennå delt.",
        copyLink: "Kopier lenke til mappa",
        removeLink: "Fjern lenke til mappe",
        link: "Lenken er kopiert",
        savedLink: "Lenke til  {{ name }} er lagt til i Mine mapper.",
        savedLinkFailed: "Klarte ikke å legge til lenke til Mine mapper.",
        unSavedLink: "Lenke til  {{ name }} er fjernet fra Mine mapper.",
        unSavedLinkFailed: "Klarte ikke å fjerne fra Mine mapper.",
        sharedHeader: "Denne mappa er delt",
        folderShared: "Denne mappa er delt.",
        folderSharedFailed: "Klarte ikke å dele mappen.",
        description: {
          copy: "Trykk på lenke for å kopiere",
          private:
            "Når du deler ei mappe, lager du ei lenke som er åpen for alle som har lenka. Du kan endre innholdet eller avslutte delinga når du ønsker det. ",
          shared:
            "Nå kan du dele denne lenka med elever eller andre lærere. Hvis du gjør endringer i mappa, blir de synlige for alle du har delt lenka med.",
        },
        warning: {
          authenticated:
            "Denne mappen er delt av {{ name }}, og  inneholder fagstoff, oppgaver og lenker til tekster fra både NDLA og andre nettsteder.",
          unauthenticated:
            "Denne mappen er delt av {{ name }}, og  inneholder fagstoff, oppgaver og lenker til tekster fra både NDLA og andre nettsteder. Logg inn på Min NDLA for å kopiere mappen eller lagre lenken.",
        },
        button: {
          share: "Del mappe",
          shareShort: "Del",
          preview: "Forhåndsvis mappe",
          previewShort: "Forhåndsvis",
          goTo: "Gå til delt mappe",
          unShare: "Avslutt deling",
          shareLink: "Kopier lenke",
          saveLink: "Lagre lenken",
          unSaveLink: "Fjern lenken",
        },
        save: {
          warning:
            "Dette lager en lenke til mappen i Mine mapper. Du kan enkelt finne den igjen ved å gå til Mine mapper i menyen i Min NDLA.",
          header: "Lagre lenke til denne mappen",
          save: "Lagre lenke til delt mappe",
        },
        previewInformation:
          "Forhåndsvisning av delt mappe. Mappa blir ikke tilgjengelig for andre før du setter den som delt.",
      },
    },
    iconMenu: {
      folders: "Mapper",
      tags: "Emneknagger",
      subjects: "Favorittfag",
      profile: "Profil",
      more: "Mer",
      learningpath: "Læringsstier",
    },
    tagList: "Emneknagger",
    tags_one: "{{count}} emneknagg",
    tags_other: "{{count}} emneknagger",
    moreTags_one: "Vis en emneknagg til",
    moreTags_other: "Vis {{count}} emneknagger til",
    confirmDeleteFolder:
      "Er du sikker på at du vil slette mappen? Dersom mappen har undermapper vil disse også slettes. Handlingen kan ikke endres.",
    confirmDeleteTag: "Er du sikker på at du vil slette emneknagg? Denne handlingen kan ikke endres.",
    myFolders: "Mine mapper",
    sharedByOthersFolders: "Mapper andre har delt",
    myTags: "Mine emneknagger",
    mySubjects: "Mine fag",
    newFolder: "Ny mappe",
    newFolderShort: "Ny",
    newFolderUnder: "Lag ny mappe under {{folderName}}",
    myAccount: "Min konto",
    favourites: "Favoritter",
    addToFavourites: "Legg til i mine favoritter",
    alreadyFavourited: "Allerede lagt til i mine favoritter",
    alreadyInFolder: "Finnes allerede i mappen. Du kan fortsatt lagre nye emneknagger.",
    addInSharedFolder: "Denne mappen er delt. Innhold du legger til vil også bli delt.",
    noFolderSelected: "Velg eller opprett ny mappe for å lagre ressursen",
    examLockInfo: "Redigering av innhold på Min NDLA er deaktivert for elever i eksamensperioden.",
    copyFolderDisclaimer:
      "Dette lager en kopi av mappen. Eventuelle endringer i originalmappen vil ikke bli oppdatert her.",
    loginCopyFolderPitch: "Ønsker du å kopiere denne mappen?",
    loginSaveFolderLinkPitch: "Ønsker du å lagre lenken til denne delte mappen?",
    help: "Hjelp",
    more: "Flere valg",
    selectView: "Velg visning",
    listView: "Listevisning",
    detailView: "Detaljert listevisning",
    shortView: "Kort visning",
    userPictureAltText: "Profilbilde",
    myPage: {
      noRecents: "Du har ikke lagt til noen ressurser ennå. Slik kommer du i gang:",
      imageAlt:
        "Halvnært bilde av jente som holder et nettbrett i hendene. Oppå nettbrettet ligger det ei samling fargeprøver i ulike former og farger. Grafikk.",
      confirmDeleteAccount: "Er du sikker på at du vil slette kontoen?",
      confirmDeleteAccountButton: "Slett konto",
      myPage: "Min side",
      deleteAccount: "Slett brukerprofil",
      loginPitch:
        "Velkommen til Min NDLA! Her kan du lagre favorittressursene dine fra NDLA, organisere dem og dele dem med andre. Logg inn med din Feide-konto for å komme i gang.",
      loginPitchButton: "Logg inn i Min NDLA",
      logout: "Logg ut av Min NDLA",
      loginIngress:
        "Her kan du organisere fagstoffet på <b>din</b> måte! Bruk hjerteknappen til å markere dine favorittfag eller ressurser, og finne dem enkelt igjen.",
      loginText:
        "For å kunne bruke tjenesten Min NDLA må du være elev eller jobbe på en skole i et fylke som er med i NDLA-samarbeidet.",
      loginTextLink: "Les vår personvernerklæring her",
      loginTerms: "Logg på med Feide for å få tilgang. Ved å logge på godkjenner du våre vilkår for bruk",
      loginResourcePitch: "Ønsker du å favorittmerke denne ressursen?",
      loginWelcome: "Velkommen til Min NDLA!",
      welcome:
        "Velkommen til Min NDLA! Nå kan du lagre favorittressursene dine fra NDLA og organisere dem i mapper og med emneknagger.",
      read: { read: "Les", our: " vår." },
      privacy: "personvernerklæringa",
      privacyLink: "https://ndla.no/article/personvernerklaering",
      questions: { question: "Lurer du på noe?", ask: "Spør NDLA" },
      wishToDelete: "Vil du ikke ha brukerprofil hos oss lenger?",
      terms: {
        terms: "Vilkår for bruk",
        term1: "Ikke skriv personsensitiv informasjon eller persondata i tekstfelt.",
        term2: "Ikke skriv noe støtende i tekstfelt.",
        term3: "NDLA forbeholder seg retten til å oppdatere eller slette utdaterte ressurser.",
      },
      recentFavourites: {
        title: "Nylig lagt til i mine mapper",
        link: "Se alle mappene dine",
        search: "Søk etter ressurser",
        unauthorized: "Oops. Her var det tomt! Hjertemerk noen ressurser for å vise dem her.",
      },
      favouriteSubjects: {
        noFavorites:
          "Ingen favorittfag? Bruk hjerteknappen for å legge til favorittfag, så finner du dem enkelt igjen!",
        search: "Se alle fag",
        viewAll: "Se alle favorittfag",
      },
      feide: "Dette henter vi om deg gjennom Feide",
      feideWrongInfo:
        "Dersom informasjon er feil, så må dette oppdateres av vertsorganisasjon/skoleeier som brukeren tilhører. Oversikt over brukerstøtte finnes her: feide.no/brukerstotte",
    },
    myProfile: {
      title: "Min profil",
      disclaimerTitle: {
        employee: "Hvor brukes navnet mitt?",
        student: "Hvor brukes navnet mitt?",
      },
      disclaimerText: {
        employee:
          "Navnet ditt vises når du deler en mappe eller en læringssti. Dersom du ikke ønsker å dele navnet ditt kan du avslutte deling av mapper eller læringsstier.",
        student: "Navnet ditt vises bare for deg selv når du er logget inn.",
      },
      editButtonText: "Endre profilbilde",
      modalTexts: {
        title: "Last opp nytt profilbilde",
        uploadSection: {
          title: "Dra og slipp",
          subTitle: "eller trykk for å laste opp bilde",
        },
        fileName: "Opplastet fil:",
        fileTypes: "Godkjente filtyper: PNG, JPG (Maks 5MB)",
        savePicture: "Lagre profilbilde",
        deletePicture: "Slett profilbilde",
      },
    },
    favoriteSubjects: {
      title: "Mine fag",
      subjects_one: "{{count}} fag",
      subjects_other: "{{count}} fag",
      noFavorites: "Hjertemerk fag, så dukker de opp her.",
      goToAllSubjects: "Gå til alle fag",
    },
    tools: "Verktøy",
    simpleList: "Enkel liste",
    detailedList: "Med ingress",
  },
  ndlaFilm: {
    heading: "NDLA film",
    slideBackwardsLabel: "Scroll bakover",
    slideForwardsLabel: "Scroll fremover",
    films: "Filmer",
    topics: "Emner",
    filterFilms: "Filtrer filmer",
    about: {
      more: "Les mer om NDLA film",
    },
    search: {
      categoryFromNdla: "Utvalg fra NDLA",
    },
  },
  filmfrontpage: {
    resourcetype: {
      documentary: "Dokumentar",
      featureFilm: "Spillefilm",
      series: "Tv-serie",
      shortFilm: "Kortfilm",
      all: "Alle filmer A-Å",
    },
    allMovieGroupTitleLabel: "Filmer som starter på {{letter}}",
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
    properUrl: "Dette feltet kan kun innholde en gyldig lenke. Eks: https://ndla.no",
  },
  lti: {
    embed: "Sett inn",
    notSupported:
      "Det fungerte ikke å sette inn innholdet automatisk. Kopier kildekoden under for å sette inn på din side.",
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
    skipToContent: "Hopp til innhold",
    menuOptions: {
      programme: "Utdanningsprogram",
      subjects: "Fag",
      multidisciplinarySubjects: "Tverrfaglige tema",
      toolboxStudents: "Verktøykassa - for elever",
      toolboxTeachers: "Verktøykassa - for lærere",
      film: "NDLA film",
    },
    menu: {
      button: "Meny",
      goToMainMenu: "Gå til hovedmeny",
      search: "Søk",
      title: "Åpne meny",
      modalLabel: "Velg innhold",
    },
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
  toolboxPage: {
    introduction:
      "Hva vil det si å arbeide utforskende? Hvordan kan du lære bedre? Hva skal til for å få gruppearbeid til å fungere? I Verktøykassa finner både elever og lærere ressurser som er aktuelle for alle fag, og som støtter opp under læringsarbeid og utvikling av kunnskap, ferdigheter og forståelse.",
  },
  welcomePage: {
    resetSearch: "Tøm søk",
    programmes: "Utdanningsprogram",
    heading: {
      heading: "Nasjonal digital læringsarena",
    },
  },
  learningpathPage: {
    accordionTitle: "Innhold i læringssti",
    learningsteps: "Læringssteg",
    stepCompleted: "Fullført",
    externalWarning:
      "Denne læringsstien er utarbeidet av en ekstern lærer, som har det redaksjonelle ansvaret. Vær oppmerksom på at den kan inneholde tekster og lenker som ikke kommer fra ndla.no.",
    externalLink: "Åpne i nytt vindu",
    bylineSuffix:
      "Læringsstien er satt sammen av en lærer. NDLA har ikke redaksjonelt ansvar for denne stien. Stien kan inneholde tekster og lenker som ikke kommer fra ndla.no.",
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
    title: "Ressurser på {{language}}",
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
  treeStructure: {
    maxFoldersAlreadyAdded: "Maks nivå av undermapper nådd",
    newFolder: {
      placeholder: "Skriv navn på mappe",
      folderName: "Mappenavn",
    },
  },
  competenceGoals: {
    competenceGoalTitle: "Målet er at eleven skal kunne:",
    licenseData: "Inneholder data under",
    licenseFrom: "tilgjengeliggjort på",
    competenceGoalResourceSearchText: "Vis ressurser til {{code}}",
    coreResourceSearchText: "Vis ressurser til kjerneelement {{code}}",
    competenceTabLK20label: "Kompetansemål",
    competenceTabCorelabel: "Kjerneelement",
    modalText: "Utforsk læreplankoblinger",
    showCompetenceGoals: "Vis kompetansemål",
    competenceGoalItem: {
      title: "Kompetansemål og vurdering",
    },
  },
  subjectFrontPage: {
    buildsOn: "Bygger på",
    connectedTo: "Felles programfag sammen med",
    leadsTo: "Leder til",
  },
  learningPath: {
    youAreInALearningPath: "Du er nå inne i en læringssti",
    nextArrow: "Gå til neste steg",
    previousArrow: "Gå til forrige steg",
    lastUpdated: "Sist oppdatert",
    lastStep: {
      heading: "Siste steg i læringsstien",
      headingSmall: "Du er nå på siste steget i læringsstien {{learningPathName}}",
      topicHeading: "Gå til emne:",
      subjectHeading: "Gå til faget:",
    },
  },
  createdBy: {
    content: "Ressursen",
    text: "er hentet fra",
  },
  tagSelector: {
    placeholder: "Skriv inn emneknagg",
  },
  notFoundPage: {
    title: "Siden finnes ikke",
    errorDescription: "Beklager, finner ikke siden du prøvde å komme til.",
  },
  unpublishedResourcePage: {
    title: "Ressursen er avpublisert",
    errorDescription: "Beklager, ressursen du prøvde å komme til er avpublisert.",
  },
  messageBoxInfo: {
    noContent: "Vi har dessverre ikke noen programfag ennå.",
    resources: "Dette er ikke et komplett læremiddel, men ei ressurssamling som vi håper kan være nyttig for deg.",
    subjectOutdated: "Dette faget følger en utgått læreplan.",
    subjectBeta: "Dette faget er under utvikling. Vi fyller på med ressurser fortløpende.",
    frontPageExpired:
      "Utgåtte fag undervises det ikke i lenger, men det kan fortsatt være mulig å ta eksamen i faga som privatist.",
  },
  programmes: {
    header: "Hva vil du lære om i dag?",
    description: "Velg utdanningsprogram for å se dine fag",
    grades: "Trinn",
  },
  common: {
    subject_one: "Fag",
    subject_other: "Fag",
  },
  resource: {
    noCoreResourcesAvailableUnspecific: "Det er ikke noe kjernestoff tilgjengelig.",
    noCoreResourcesAvailable: "Det er ikke noe kjernestoff for {{name}}.",
    activateAdditionalResources: "Tilleggsstoff",
    label: "Læringsressurser",
    tooltipCoreTopic: "Kjernestoff",
    tooltipAdditionalTopic: "Tilleggsstoff",
    additionalTooltip: "Tilleggsstoff",
    trait: {
      audio: "Lyd",
      h5p: "Interaktiv",
      podcast: "Podkast",
      video: "Video",
    },
  },
  navigation: {
    additionalTopic: "Tilleggsemne",
  },
  siteNav: {
    close: "Lukk søk",
  },
  labels: {
    other: "Annet",
  },
  multidisciplinarySubject: {
    subjectsLinksDescription: "Case innen",
  },
  frontpageMenu: {
    allsubjects: "Alle fag",
  },
  frontpageMultidisciplinarySubject: {
    text: "De tre tverrfaglige temaene i læreplanverket tar utgangspunkt i aktuelle samfunnsutfordringer som krever engasjement og innsats fra enkeltmennesker og fellesskapet i lokalsamfunnet, nasjonalt og globalt.",
  },
  footer: {
    vision: "Sammen skaper vi framtidas læring",
    linksHeader: "Kontakt",
    info: "Nettstedet er utarbeidet som åpen kildekode.",
    editorInChief: "Ansvarlig redaktør:",
    availabilityLink: "Tilgjengelighetserklæring",
    privacyLink: "Personvernerklæring",
    cookiesLink: "Erklæring for informasjonskapsler",
    aboutWebsite: "Om nettstedet",
    followUs: "Følg oss",
    socialMediaLinks: {
      facebook: "NDLA på Facebook",
      newsletter: "Meld deg på vårt nyhetsbrev",
      youtube: "NDLA på YouTube",
      linkedin: "NDLA på LinkedIn",
      instagram: "NDLA på Instagram",
    },
    ndlaLinks: {
      omNdla: "Om NDLA",
      aboutNdla: "About NDLA",
      contact: "Kontakt oss",
    },
    otherLanguages: "Andre språk",
  },
  user: {
    loggedInAs: "Du er pålogget som {{role}}.",
    role: {
      employee: "ansatt",
      student: "elev",
    },
    buttonLogIn: "Logg inn med Feide",
    buttonLogOut: "Logg ut",
    resource: {
      accessDenied: "Vi beklager, men denne ressursen er bare for lærere innlogget med Feide.",
    },
    primarySchool: "hovedskole",
    name: "Navn",
    mail: "E-post",
    username: "Brukernavn",
    wrongUserInfoDisclaimer:
      "Dersom informasjonen er feil, må den oppdateres av vertsorganisasjon/skoleeier som brukeren tilhører. Oversikt over brukerstøtte finnes her: ",
  },
};

export default messages;
