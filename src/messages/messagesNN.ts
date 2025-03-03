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
  subjectsPage: {
    tabFilter: {
      label: "Kva fag vil du vise?",
      all: "Alle fag og ressursar",
    },
    subjectGroup: 'Gruppe "{{ category }}"',
    myFavoriteSubjects: "Favorittfaga dine",
    scrollToGroup: "Hopp til gruppe",
    errorDescription: "Orsak, ein feil oppstod under lasting av faga.",
    allSubjects: "Alle fag",
    alphabeticSort: "Fag gruppert alfabetisk",
    addConfirmed: "{{subject}} er lagt til som favorittfag",
    removeConfirmed: "{{subject}} er fjerna frå favorittfag",
    addFavorite: "Legg til favorittfag",
    removeFavorite: "Fjern favorittfag",
    confirmRemove: "Er du sikker på at du vil fjerne {{subject}} fra favorittfag?",
    subjectFavoritePitch: "Ønsker du å favorittmerke dette faget?",
    subjectFavoriteGuide:
      "For å favorittmerke eit fag må du logge inn på Min NDLA. Du finn faget øverst på denne sida etter at du har logga inn.",
  },
  topicsPage: {
    topics: "Emne",
  },
  searchPage: {
    title: "Søk på ndla.no",
    filterSearch: "Filtrer søket ditt:",
    subjectLetter: "Fag som startar på {{letter}}",
    resourceTypeFilter: "Ressurstypar",
    noHits: "Ingen artiklar samsvarte med søket ditt på: {{query}}",
    noHitsShort: "Ingen treff på søk: {{query}}",
    removeFilterSuggestion: "Prøv å fjerne filter",
    search: "Søk",
    abilities: "Eigenskapar",
    close: "Lukk",
    searchFieldPlaceholder: "Søk i fagstoff, oppgåver og aktivitetar eller læringsstiar",
    searchFieldPlaceholderShort: "Søk",
    label: {
      subjects: "Fag:",
    },
    includes: "Inneheld:",
    searchField: {
      contentTypeResultShowMoreLabel: "Sjå fleire resultat",
      contentTypeResultShowLessLabel: "Sjå færre resultat",
      allResultButtonText: "Vis alle søketreff",
      searchResultHeading: "Forslag:",
      contentTypeResultNoHit: "Ingen treff på søk ...",
    },
    searchResultListMessages: {
      subjectsLabel: "Opne i fag:",
      noResultHeading: "Hmm, ikkje noko innhald ...",
      noResultDescription:
        "Vi har dessverre ikkje noko å tilby her. Om du vil foreslå innhald til dette området, kan du bruke Spør NDLA-knappen som du finn nede til høgre på skjermen.",
    },
    searchFilterMessages: {
      backButton: "Tilbake til filter",
      filterLabel: "Filtrer søket",
      confirmButton: "Oppdater filter",
      hasValuesButtonText: "Fleire fag",
      noValuesButtonText: "Filtrer på fag",
      useFilter: "Bruk filter",
      removeFilter: "Fjern filter {{filterName}}",
      closeFilter: "Lukk filter",
      additionalSubjectFilters: "+ {{count}} fag",
      coreRelevance: "Kjernestoff",
      supplementaryRelevance: "Tilleggsstoff",
      resourceTypeFilter: {
        heading: "Filtrer på innhaldstype",
        button: "Filtrer på innhaldstype",
      },
    },
    resultType: {
      showing: "Viser {{count}} av {{totalCount}} {{contentType}}",
      showingAll: "Viser alle",
      showMore: "Vis meir",
      showAll: "Vis alle",
      toTopOfPage: "Til toppen",
      toSubjectPageLabel: "Gå til fagsida",
      all: "Alle",
      allContentTypes: "Alle innhaldstyper",
      hits: "{{count}} treff",
      showingSearchPhrase: "Viser treff for",
      searchPhraseSuggestion: "Søk heller",
      showingCompetenceGoalSearchPhrase: "Viser resultat for kompetansemål {text}",
      notionLabels: "Brukes i",
      notionsHeading: "Begrepsforklaring",
      notionsRemove: "Fjern",
      showVideo: "Sjå video",
      concept: "Begrepsforklaring",
      gridView: "Gallerivisning",
      listView: "Listevisning",
      gloss: "Glose",
    },
    contextModal: {
      button: "+ {{count}} fleire stader",
      heading: "Ressursen er brukt fleire stader",
      ariaLabel: "Sjå fleire kontekstar",
    },
  },
  myNdla: {
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
      added: "Lagt til",
      removed: "Fjerna",
      showTags: "Vis emneknaggar",
      tagsDialogTitle: "Emneknaggar tilknytta ressurs {{title}}",
      noTags: "Ingen emneknaggar.",
      add: "Legg til mappe/emneknagg",
      remove: "Fjern",
      removeTitle: "Fjern ressurs",
      confirmRemove: "Er du sikker på at du ønsker å fjerne ressursen frå denne mappa?",
      copyLink: "Kopier lenke til sida",
      linkCopied: "Kopiert til utklippstavla",
      addToMyNdla: "Legg i Min NDLA",
      addedToMyNdla: "Lagt i Min NDLA",
      copyToMyNdla: "Kopier til Min NDLA",
      addedToFolder: "Ressurs er lagt i ",
      removedFromFolder: 'Fjerna fra "{{folderName}}"',
      titleUpdated: "Tittel oppdatert",
      tagsUpdated: "Emneknaggar oppdaterte",
      show: "Vis",
      save: "Lagre ressurs",
      onDragStart: "Plukka opp ressursen {{name}}. Ressursen er på posisjon {{index}} av {{length}}",
      onDragOver: "Ressursen {{name}} vart flytta til posisjon {{index}} av {{length}}",
      onDragOverMissingOver: "Ressursen {{name}} er ikkje lenger over eit område der han kan sleppast",
      onDragEnd: "Ressursen {{name}} vart sleppt på posisjon {{index}} av {{length}}",
      onDragEndMissingOver: "Ressursen vart sleppt",
      onDragCancel: "Flytting avbroten. Ressursen {{name}} vart sleppt",
      dragHandle: "Sorter ressursen {{name}}",
    },
    sharedFolder: {
      learningpathUnsupportedTitle: "Læringsstier støttast ikkje",
      resourceRemovedTitle: "Ressurs ikkje tilgjengeleg",
      folderCopied: "Mappa vart kopiert.",
      info: "Denne mappa inneheld fagstoff og oppgåver frå NDLA, samla av ein lærar.",
      shared: "Denne mappa inneheld fagstoff og oppgåver frå NDLA, samla av {{sharedBy}}.",
      aTeacher: "ein lærar",
      firstShared: "Mappa vart delt første gong {{date}}",
      drawerButton: "Vis mapper og ressursar",
      drawerTitle: "Mapper og ressursar",
      learningpathUnsupported:
        "Læringsstiar og tverrfaglege caser kan ikkje visast direkte i delte mapper. Dersom du trykker på lenka i navigasjonsmenyen til venstre, blir stien opna i ei ny fane.",
      description:
        "I denne delte mappa finn du fagstoff og oppgåver frå NDLA. Artiklane er samla inn og sette i rekkefølge av ein lærar.",
      willOpenInNewTab: "Blir opna i ny fane.",
    },
    acceptedShareName: {
      title: "No viser vi namnet ditt når du deler",
      subtitle: "Vi har endra visninga på delte mapper. No visast namnet ditt på alle delte mapper og læringsstier.",
      description:
        "Dersom du ikkje ønsker at namnet ditt skal være synleg kan du avslutte deling av mapper og læringsstier.",
      button: "OK",
      accept: {
        error: "Kunne ikke lagre",
      },
    },
    arena: {
      title: "Arenaen",
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
          titleHelper: "Skriv ein beskrivande tittel for læringsstien",
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
            labelHelper: "Søk etter artikkel",
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
            copyright:
              "Alt du skriv i ein læringssti på NDLA blir publisert under lisensen CC BY-SA. Dette betyr at andre kan bruke, tilpasse og bygge videre på arbeidet ditt, så lenge dei gir deg kreditering.",
            copyrightLink: "Les meir om NDLA og deling av innhald her",
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
            noResources: "Du har ikkje lagt til nokon ressursar i mappene dine enno.",
            label: "Søk i Mine mapper",
            labelHelper: "Vel innhald frå dine mapper",
            placeholder: "Søk etter ressursar som ligg i dine mapper",
            error: "Noko gjekk gale ved henting av ressursar",
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
          title: "Tittel",
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
      copy: {
        title: "Kopier læringssti",
        description:
          "Ved å kopiere ein læringssti blir han lagd til i lista over dine læringsstiar. Du kan deretter redigere og tilpasse stien slik du ønskjer.",
        button: "Kopier til mine læringsstiar",
        success: { title: "Kopiert", description: "Læringsstien er kopiert til " },
        error: "Noko gjekk gale ved kopiering av læringsstien",
        loginCopyPitch: "Ønskjer du å kopiere denne læringsstien?",
      },
    },
    description:
      "Min NDLA: Organiser fagstoffet på din måte! Bruk NDLAs praterobot (AI/KI). Lagre og del med kollegaer og elevar.",
    mainMenu: "Hovedmeny",
    myNDLA: "Min NDLA",
    myNDLAMenu: "Min NDLA meny",
    support: "Brukarstøtte",
    resources_one: "{{count}} ressurs",
    resources_other: "{{count}} ressursar",
    folders_one: "{{count}} mappe",
    folders_other: "{{count}} mapper",
    settings: "Innstillingar",
    showEditOptions: "Vis redigeringsmoglegheiter",
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
      updated: "Mappa har blitt oppdatert",
      defaultPageDescription: "Legg til beskriving ved å redigere mappa",
      missingName: "Skriv namn på mappe",
      folderDeleted: '"{{folderName}}" er sletta',
      folderCreated: '"{{folderName}}" er oppretta',
      onDragStart: "Plukka opp mappa {{name}}. Mappa er på posisjon {{index}} av {{length}}",
      onDragOver: "Mappa {{name}} vart flytta til posisjon {{index}} av {{length}}",
      onDragOverMissingOver: "Mappa {{name}} er ikkje lenger over eit område der ho kan sleppast",
      onDragEnd: "Mappa {{name}} vart sleppt på posisjon {{index}} av {{length}}",
      onDragEndMissingOver: "Mappa vart sleppt",
      onDragCancel: "Flytting avbroten. Mappa {{name}} vart sleppt",
      dragHandle: "Sorter mappa {{name}}",
      professional: "ein fagperson",
      sharedWarning: "Namn og skildring blir synleg for alle du deler mappa med.",
      sharing: {
        share: "Del mappe",
        shared: "Delt",
        sharedBy: "Delt av ",
        sharedByAnonymous: "anonym lærar",
        sharedFolder: "Delt mappe",
        unShare: "Delinga er avslutta. Mappa er ikkje lenger delt",
        link: "Lenka er kopiert",
        copyLink: "Kopier lenke til mappa",
        removeLink: "Fjern lenke til mappe",
        savedLink: "Lenka til  {{ name }} er lagt til i Mine mapper.",
        unSavedLink: "Lenka til  {{ name }} er fjernet fra Mine mapper.",
        header: {
          shared: "Denne mappa er delt",
        },
        description: {
          copy: "Trykk på lenke for å kopiere",
          private:
            "Når du deler ei mappe, lagar du ei lenke som er open for alle som har lenka. Du kan endre innhaldet eller avslutte delinga når du ønsker det.",
          shared:
            "No kan du dele denne lenka med elevar eller andre lærarar. Dersom du gjer endringar i mappa, blir dei synlege for alle du har delt lenka med.",
        },
        warning: {
          authenticated:
            "Denne mappa er delt av {{ name }}, og inneheld fagstoff, oppgåver og lenker til tekster frå både NDLA og andre nettstader.",
          unauthenticated:
            "Denne mappa er delt av {{ name }}, og inneheld fagstoff, oppgåver og lenker til tekster frå både NDLA og andre nettstader. Logg inn på Min NDLA for å kopiere mappa eller lagre lenka.",
        },
        button: {
          share: "Del mappe",
          shareShort: "Del",
          preview: "Førehandsvis mappe",
          previewShort: "Førehandsvis",
          goTo: "Gå til delt mappe",
          unShare: "Avslutt deling",
          shareLink: "Kopier lenke",
          saveLink: "Lagre lenka",
          unSaveLink: "Fjern lenka",
        },
        save: {
          warning:
            "Dette lagar ei lenke til mappa i Mine mapper. Du kan enkelt finne ho att ved å gå til Mine mapper i menyen i Min NDLA.",
          header: "Lagre lenke til denne mappa",
          save: "Lagre lenke til delt mappe",
        },
        previewInformation:
          "Førehandsvising av delt mappe. Mappa blir ikkje tilgjengeleg for andre før du set ho som delt.",
      },
    },
    iconMenu: {
      folders: "Mapper",
      tags: "Emneknaggar",
      subjects: "Favorittfag",
      profile: "Profil",
      more: "Meir",
      learningpath: "Læringsstiar",
    },
    tagList: "Emneknaggar",
    tags_one: "{{count}} emneknagg",
    tags_other: "{{count}} emneknaggar",
    moreTags_one: "Vis ein emneknagg til",
    moreTags_other: "Vis {{count}} emneknaggar til",
    confirmDeleteFolder:
      "Er du sikker på at du vil slette mappa? Dersom mappa har undermapper vil desse også slettast. Denne handlinga kan ikkje endrast.",
    confirmDeleteTag: "Er du sikker på at du vil slette tag? Denne handlinga kan ikkje endrast.",
    myFolders: "Mine mapper",
    sharedByOthersFolders: "Mapper andre har delt",
    myTags: "Mine emneknaggar",
    mySubjects: "Mine fag",
    newFolder: "Ny mappe",
    newFolderShort: "Ny",
    newFolderUnder: "Lag ny mappe under {{folderName}}",
    myAccount: "Min konto",
    favourites: "Favorittar",
    addToFavourites: "Legg til i mine favorittar",
    alreadyFavourited: "Allereie lagt til i mine favorittar",
    alreadyInFolder: "Finst allereie i mappa. Du kan fortsatt lagre nye emneknaggar.",
    addInSharedFolder: "Denne mappa er delt. Innhald du legg til vil også bli delt.",
    noFolderSelected: "Velg eller opprett ny mappe for å lagre ressursen",
    examLockInfo: "Redigering av innhald på Min NDLA er deaktivert for elevar i eksamensperioden.",
    copyFolderDisclaimer:
      "Dette lagar ein kopi av mappa. Eventuelle endringar i originalmappa vil ikkje bli oppdatert her.",
    loginCopyFolderPitch: "Ønsker du å kopiere denne mappa?",
    loginSaveFolderLinkPitch: "Ønsker du å lagra lenka til denne delte mappa?",
    help: "Hjelp",
    more: "Fleire val",
    selectView: "Velg visning",
    listView: "Listevisning",
    detailView: "Detaljert listevisning",
    shortView: "Kortvisning",
    userPictureAltText: "Profilbilete",
    myPage: {
      noRecents: "Du har ikkje lagt til ressursar enno. Slik kjem du i gang:",
      imageAlt:
        "Halvnært bilete av jente som held eit nettbrett i hendene. Oppå nettbrettet ligg det ei samling fargeprøver i ulike former og fargar. Grafikk.",
      confirmDeleteAccount: "Er du sikker på at du vil slette kontoen?",
      confirmDeleteAccountButton: "Slett konto",
      myPage: "Mi side",
      deleteAccount: "Slett brukarprofil",
      loginPitch:
        "Velkommen til Min NDLA! Her kan du lagre favorittressursane dine frå NDLA, organisere dei og dele dei med andre. Logg inn med din Feide-konto for å komme i gang.",
      loginPitchButton: "Logg inn i Min NDLA",
      logout: "Logg ut av Min NDLA",
      loginIngress:
        "Her kan du organisere fagstoffet på <b>din</b> måte! Bruk hjarteknappen for å markere favorittfaga eller favorittressursane dine og enkelt finne dei igjen.",
      loginText:
        "For å kunne bruke tjenesten Min NDLA må du vere elev eller jobbe på ein skule i eit fylke som er med i NDLA-samarbeidet.",
      loginTextLink: "Les personvernerklæringa vår her",
      loginTerms: "Logg på med Feide for å få tilgang. Ved å logge på godkjenner du vilkåra våre for bruk",
      loginResourcePitch: "Ønsker du å favorittmerke denne ressursen?",
      loginWelcome: "Velkommen til Min NDLA!",
      welcome:
        "Velkommen til Min NDLA! No kan du lagre favorittressursane dine frå NDLA og organisere dei i mapper og med emneknaggar.",
      read: { read: "Les", our: " vår." },
      privacy: "personvernerklæringa",
      privacyLink: "https://ndla.no/article/personvernerklaering",
      questions: { question: "Lurer du på noko?", ask: "Spør NDLA" },
      wishToDelete: "Vil du ikkje ha brukerprofil hos oss lenger?",
      terms: {
        terms: "Vilkår for bruk",
        term1: "Ikkje skriv personsensitiv informasjon eller persondata i tekstfelt.",
        term2: "Ikkje skriv noko støytande i tekstfelt.",
        term3: "NDLA tek atterhald om retten til å oppdatere eller slette utdaterte ressursar.",
      },
      recentFavourites: {
        title: "Nyleg lagt til i mappene mine",
        link: "Sjå alle mappene dine",
        search: "Søk etter ressursar",
        unauthorized: "Oops. Her var det tomt! Hjartemerk nokre ressursar for å sjå dei her.",
      },
      favouriteSubjects: {
        noFavorites: "Ingen favorittfag? Bruk hjarteknappen for å legge til favorittfag, så finn du dei enkelt att!",
        search: "Sjå alle fag",
        viewAll: "Sjå alle favorittfag",
      },
      feide: "Dette hentar vi om deg gjennom Feide",
      feideWrongInfo:
        "Dersom informasjon er feil, så må dette oppdaterast av vertsorganisasjon/skuleeigar som brukaren tilhøyrer. Oversyn over brukarstøtte finst her: feide.no/brukerstotte",
    },
    myProfile: {
      title: "Min profil",
      disclaimerTitle: {
        employee: "Kvar blir namnet mitt brukt?",
        student: "Kvar blir namnet mitt brukt?",
      },
      disclaimerText: {
        employee:
          "Namnet ditt blir vist når du deler ei mappe eller ein læringssti. Dersom du ikkje ønskjer å dele namnet ditt, kan du avslutte deling av mapper eller læringsstiar.",
        student: "Namnet ditt blir berre vist for deg sjølv når du er logga inn.",
      },
      editButtonText: "Endre profilbilete",
      modalTexts: {
        title: "Last opp nytt profilbilete",
        uploadSection: {
          title: "Dra og slepp",
          subTitle: "eller trykk for å lasta opp bilete",
        },
        fileName: "Opplasta fil:",
        fileTypes: "Godkjente filtyper: PNG, JPG (Maks 5MB)",
        savePicture: "Lagre profilbilete",
        deletePicture: "Slett profilbilete",
      },
    },
    favoriteSubjects: {
      title: "Mine fag",
      subjects_one: "{{count}} fag",
      subjects_other: "{{count}} fag",
      noFavorites: "Hjartemerk fag, så dukkar dei opp her.",
      goToAllSubjects: "Gå til alle fag",
    },
    tools: "Verktøy",
    simpleList: "Enkel liste",
    detailedList: "Med ingress",
  },
  ndlaFilm: {
    heading: "NDLA film",
    slideBackwardsLabel: "Scroll bakover",
    slideForwardsLabel: "Scroll framover",
    films: "Filmar",
    topics: "Emne",
    filterFilms: "Filtrer filmar",
    about: {
      more: "Les meir om NDLA film",
    },
    search: {
      categoryFromNdla: "Utval frå NDLA",
    },
  },
  filmfrontpage: {
    resourcetype: {
      documentary: "Dokumentar",
      featureFilm: "Spelefilm",
      series: "TV-serie",
      shortFilm: "Kortfilm",
      all: "Alle filmar A-Å",
    },
    allMovieGroupTitleLabel: "Filmar som startar på {{letter}}",
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
    properUrl: "Dette feltet kan berre innehalde ein gyldig lenke. Eks: https://ndla.no",
  },
  lti: {
    embed: "Sett inn",
    notSupported:
      "Det fungerte ikkje å setje inn innhaldet automatisk. Kopier kjeldekoden under for å setje han inn på sida di.",
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
    skipToContent: "Hopp til innhald",
    menuOptions: {
      programme: "Utdanningsprogram",
      subjects: "Fag",
      multidisciplinarySubjects: "Tverrfaglege tema",
      toolboxStudents: "Verktøykassa - for elevar",
      toolboxTeachers: "Verktøykassa - for lærarar",
      film: "NDLA film",
    },
    menu: {
      button: "Meny",
      goToMainMenu: "Gå til hovedmeny",
      search: "Søk",
      title: "Åpne meny",
      modalLabel: "Vel innhald",
    },
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
  toolboxPage: {
    introduction:
      "Kva vil det seie å arbeide utforskande? Korleis kan du lære betre? Kva skal til for å få gruppearbeid til å fungere? I Verktøykassa finn både elevar og lærerar ressursar som er aktuelle for alle fag, og som støtter opp under læringsarbeid og utvikling av kunnskap, ferdigheter og forståing.",
  },
  welcomePage: {
    resetSearch: "Tøm søk",
    programmes: "Utdanningsprogram",
    heading: {
      heading: "Nasjonal digital læringsarena",
    },
  },
  learningpathPage: {
    accordionTitle: "Innhald i læringssti",
    learningsteps: "Læringssteg",
    stepCompleted: "Fullført",
    externalWarning:
      "Denne læringsstien er utarbeidd av ein ekstern lærar, som har det redaksjonelle ansvaret. Ver merksam på at ho kan innehalde tekstar og lenkjer som ikkje kjem frå ndla.no.",
    externalLink: "Åpne i nytt vindauge",
    bylineSuffix:
      "Læringsstien er satt saman av ein lærar. NDLA har ikkje redaksjonelt ansvar for denne stien. Stien kan innehalde tekstar og lenker som ikkje kjem frå ndla.no.",
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
    title: "Ressursar på {{language}}",
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
      placeholder: "Skriv namn på mappe",
      folderName: "Mappenavn",
    },
  },
  competenceGoals: {
    competenceGoalTitle: "Målet er at eleven skal kunne:",
    licenseData: "Inneheld data under",
    licenseFrom: "tilgjengeleggjort på",
    competenceGoalResourceSearchText: "Vis ressursar til {{code}}",
    coreResourceSearchText: "Vis ressursar til kjerneelement {{code}}",
    competenceTabLK20label: "Kompetansemål",
    competenceTabCorelabel: "Kjerneelement",
    modalText: "Utforsk læreplankoplingar",
    showCompetenceGoals: "Vis kompetansemål",
    competenceGoalItem: {
      title: "Kompetansemål og vurdering",
    },
  },
  subjectFrontPage: {
    buildsOn: "Bygger på",
    connectedTo: "Felles programfag saman med",
    leadsTo: "Leier til",
  },
  learningPath: {
    youAreInALearningPath: "Du er no inne i ein læringssti",
    nextArrow: "Gå til neste steg",
    previousArrow: "Gå til førre steg",
    lastStep: {
      heading: "Siste steg i læringsstien",
      headingSmall: "Du er no på siste steget i læringsstien {{learningPathName}}",
      topicHeading: "Gå til emne:",
      subjectHeading: "Gå til faget:",
    },
  },
  createdBy: {
    content: "Ressursen",
    text: "er henta frå",
  },
  tagSelector: {
    placeholder: "Skriv inn emneknagg",
  },
  notFoundPage: {
    title: "Sida finst ikkje",
    errorDescription: "Orsak, vi fann ikkje sida du prøvde å komme til.",
  },
  unpublishedResourcePage: {
    title: "Ressursen er avpublisert",
    errorDescription: "Orsak, ressursen du prøvde å komme til er avpublisert.",
  },
  messageBoxInfo: {
    noContent: "Vi har dessverre ikkje nokon programfag enno.",
    resources: "Dette er ikkje eit komplett læremiddel, men ei ressurssamling som vi håper kan vere nyttig for deg.",
    subjectOutdated: "Dette faget følgjer ein utgått læreplan.",
    subjectBeta: "Dette faget er under utvikling. Vi fyller på med ressursar fortløpande.",
    frontPageExpired:
      "Utgåtte fag blir det ikkje undervist i lenger, men det kan framleis vere mogleg å ta eksamen i faget som privatist.",
  },
  programmes: {
    header: "Kva vil du lære om i dag?",
    description: "Vel utdanningsprogram for å sjå faga dine",
    grades: "Trinn",
  },
  common: {
    subject_one: "Fag",
    subject_other: "Fag",
  },
  resource: {
    noCoreResourcesAvailableUnspecific: "Det er ikkje noko kjernestoff tilgjengeleg.",
    noCoreResourcesAvailable: "Det er ikkje noko kjernestoff tilgjengeleg for {{name}}.",
    activateAdditionalResources: "Tilleggsressursar",
    label: "Læringsressursar",
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
    other: "Anna",
  },
  multidisciplinarySubject: {
    subjectsLinksDescription: "Case innan",
  },
  frontpageMenu: {
    allsubjects: "Alle fag",
  },
  frontpageMultidisciplinarySubject: {
    text: "Dei tre tverrfaglege temaa i læreplanverket tek utgangspunkt i aktuelle samfunnsutfordringar som krev engasjement og innsats frå einskildmenneske og fellesskapet i lokalsamfunnet, nasjonalt og globalt.",
  },
  footer: {
    vision: "Saman skapar vi framtidas læring",
    linksHeader: "Kontakt",
    info: "Nettstaden er utarbeida som åpen kjeldekode.",
    editorInChief: "Ansvarleg redaktør:",
    availabilityLink: "Tilgjengelegheitserklæring",
    privacyLink: "Personvernerklæring",
    cookiesLink: "Erklæring for informasjonskapslar",
    aboutWebsite: "Om nettstaden",
    followUs: "Følg oss",
    socialMediaLinks: {
      facebook: "NDLA på Facebook",
      newsletter: "Meld deg på vårt nyheitsbrev",
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
    loggedInAs: "Du er pålogga som {{role}}.",
    role: {
      employee: "tilsett",
      student: "elev",
    },
    buttonLogIn: "Logg inn med Feide",
    buttonLogOut: "Logg ut",
    resource: {
      accessDenied: "Vi beklagar, men denne ressursen er berre for lærarar innlogga med Feide.",
    },
    primarySchool: "hovudskule",
    name: "Namn",
    mail: "E-post",
    username: "Brukarnamn",
    wrongUserInfoDisclaimer:
      "Dersom informasjonen er feil, må han oppdaterast av vertsorganisasjon/skuleeigar som brukaren tilhøyrer. Oversikt over brukarstøtte finst her: ",
  },
};

export default messages;
