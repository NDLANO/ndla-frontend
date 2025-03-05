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
  subjectsPage: {
    tabFilter: {
      label: "Hvilke fag vil du vise?",
      all: "Alle fag og ressurser",
    },
    subjectGroup: 'Joavku "{{ category }}"',
    myFavoriteSubjects: "Dine favorittfag",
    scrollToGroup: "Njuike jovkui",
    errorDescription: "Šállošat, boasttuvuohta čuožžilii fágaid viežžamis.",
    allSubjects: "Buot fágat",
    alphabeticSort: "Fágat alfabehtalaččat",
    addConfirmed: "{{subject}} lea lasihuvvon oiddotfágan",
    removeConfirmed: "{{subject}} lea sihkkojuvvon oiddotfágain",
    addFavorite: "Lasit oiddotfága",
    removeFavorite: "Sihko oiddotfága",
    confirmRemove: "Leat go sihkar ahte áiggut sihkkut {{subject}} oiddotfágain?",
    subjectFavoritePitch: "Háliidat go dán fága merket oiddotfágan?",
    subjectFavoriteGuide:
      "Vai galggat sáhttit merket fága oiddohin, fertet logget sisa Mu NDLAii. Fága gávnnat bajimusas siiddus go leat sisaloggen.",
  },
  topicsPage: {
    topics: "Fáttát",
  },
  searchPage: {
    title: "Søk på ndla.no",
    filterSearch: "Filtrer søket ditt:",
    subjectLetter: "Fag som starter på {{letter}}",
    resourceTypeFilter: "Ressurstyper",
    noHits: "Ii oktage artihkal heiven du ohcamii: {{query}}",
    noHitsShort: "Du ohcamii ii lean deaivva: {{query}}",
    removeFilterSuggestion: "Geahččal filtara jávkadit",
    search: "Oza",
    close: "Govčča",
    abilities: "Iešvuođat",
    searchFieldPlaceholder: "Oza fágaáššiin, bargobihtáin ja doaimmain dahje oahppanbálgáin",
    searchFieldPlaceholderShort: "Oza",
    label: {
      subjects: "Fága:",
    },
    includes: "Inneholder:",
    searchField: {
      contentTypeResultShowMoreLabel: "Geahča eanet bohtosiid",
      contentTypeResultShowLessLabel: "Geahča unnit bohtosiid",
      allResultButtonText: "Čájet buot ohcama deaivamiid",
      searchResultHeading: "Evttohus:",
      contentTypeResultNoHit: "Du ohcamii ii lean deaivva...",
    },
    searchResultListMessages: {
      subjectsLabel: "Raba fágas:",
      noResultHeading: "Hmm, ii lean sisdoallu...",
      noResultDescription:
        'Dađi bahábut mis ii leat mihkkege fállat dás. Jus dáhtut evttohit sisdoalu dán fáttás, sáhtát geavahit "Jeara NDLA:s" maid gávnnat vulogeahčen olgeš beale šearpmas.',
    },
    searchFilterMessages: {
      backButton: "Ruovttoluotta filtarii",
      filterLabel: "Filtarastte ohcama",
      confirmButton: "Ođasmahte filtara",
      hasValuesButtonText: "Eanet fágat",
      noValuesButtonText: "Filtarastte fága mielde",
      useFilter: "Geavat filtara",
      closeFilter: "Govčča filtara",
      removeFilter: "Sihko filtara {{filterName}}",
      additionalSubjectFilters: "+ {{count}} fága",
      coreRelevance: "Guovddášávnnas",
      supplementaryRelevance: "Lassiávnnas",
      resourceTypeFilter: {
        heading: "Filtarastte sisdoallomálle mielde",
        button: "Filtarastte sisdoallomálle mielde",
      },
    },
    resultType: {
      showing: "Čájeha {{count}} oktiibuot {{totalCount}} {{contentType}}",
      showingAll: "Čájeha visot",
      showMore: "Čájet eanet",
      showAll: "Čájet visot",
      toTopOfPage: "Álgui fas",
      toSubjectPageLabel: "Mana fágasiidui",
      all: "Buot/Visot",
      allContentTypes: "Buot sisdoallomállet",
      hits: "{{count}} deaivva/deaivama",
      showingSearchPhrase: "Čájeha deaivama",
      showingCompetenceGoalSearchPhrase: "Čájeha bohtosiid gealbomihtuid ektui {text}",
      searchPhraseSuggestion: "Oza baicca",
      notionLabels: "Geavahuvvo dás",
      notionsHeading: "Doabačilgehus",
      notionsRemove: "Sihko",
      showVideo: "Geahča video",
      concept: "Doabačilgehus",
      gridView: "Galleriijačájáhus",
      listView: "Čájáhus listtu vuođul",
      gloss: "Sánit",
    },
    contextModal: {
      button: "+ {{count}} eanet sajiin",
      heading: "Resursa lea geavahuvvon eanet sajiin",
      ariaLabel: "Geahča eanet konteavsttaid",
    },
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
      titleUpdated: "Tittel oppdatert",
      tagsUpdated: "Emneknagger oppdatert",
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
    learningpath: {
      newLearningpath: "Ny læringssti",
      editLearningpath: "Rediger læringssti",
      editLearningpathTitle: "Rediger læringsstitittel",
      form: {
        delete: "Slett",
        next: "Gå videre",
        back: "Forrige",
        deleteStep: "Slett trinn",
        deleteBody: "Innholdet kan ikke gjenopprettes",
        navigation: "Skjemanavigering",
        title: {
          titleHelper: "Gi læringsstien en beskrivende tittel",
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
            labelHelper: "Søk etter artikkel",
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
          preview: "Se igjennom",
          save: "Lagre og del",
          edit: "Rediger trinn",
          add: "Legg til trinn",
          created: "Et steg med tittel '{{ name }}' ble opprettet.",
          deleted: "Et steg med tittel '{{ name }}' ble slettet.",
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
      defaultPageDescription: "Legg til beskrivelse ved å redigere mappen",
      missingName: "Skriv navn på mappe",
      folderDeleted: '"{{folderName}}" er slettet',
      folderCreated: '"{{folderName}}" er opprettet',
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
        copyLink: "Kopier lenke til mappa",
        removeLink: "Fjern lenke til mappe",
        link: "Lenken er kopiert",
        savedLink: "Lenke til  {{ name }} er lagt til i Mine mapper.",
        unSavedLink: "Lenke til  {{ name }} er fjernet fra Mine mapper.",
        header: {
          shared: "Denne mappa er delt",
        },
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
    slideBackwardsLabel: "Rulle maŋos",
    slideForwardsLabel: "Rulle ovddas",
    films: "Filmer",
    topics: "Emner",
    filterFilms: "Filtrer filmer",
    about: {
      more: "Loga eanet NDLA filmma birra",
    },
    search: {
      categoryFromNdla: "NDLA válljenmunni",
    },
  },
  filmfrontpage: {
    resourcetype: {
      documentary: "Dokumentára",
      featureFilm: "Guoimmuhanfilbma",
      series: "Tv-ráidu",
      shortFilm: "Oanehis filbma",
      all: "Buot filmmat A-Å",
    },
    allMovieGroupTitleLabel: "Filmmat mat álget {{letter}}",
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
  lti: {
    embed: "Deavdde",
    notSupported:
      "Ii lean vejolaš bidjat sisdoalu sisa automáhtalaččat. Kopiere gáldokoda vulobealde ja bija iežat siidui.",
    goBack: "Tilbake til LTI-søk",
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
    skipToContent: "Njuike sisdollui",
    menuOptions: {
      programme: "Oahppoprográmma",
      subjects: "Fága",
      multidisciplinarySubjects: "Fágaidrasttildeaddji fáddá",
      toolboxStudents: "Reaidokássa - ohppiide",
      toolboxTeachers: "Reaidokássa - oahpaheddjiide",
      film: "NDLA Filbma",
    },
    menu: {
      button: "Fállu",
      goToMainMenu: "Mana váldofállui",
      search: "Oza",
      title: "Raba fálu",
      modalLabel: "Vállje sisdoalu",
    },
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
  toolboxPage: {
    introduction:
      "Maid mearkkaša bargat suokkardeaddji vugiin? Mo sáhtát buorebut oahppat? Mo galgá joavkobarggu oažžut doaibmat? Reaidokássas gávdnet sihke oahppit ja oahpaheaddjit resurssaid mat leat guoskevaččat buot fágaide, ja mat dorjot oahppanbarggu ja ovdánahttet máhtu, gálgga ja ipmárdusa. ",
  },
  welcomePage: {
    programmes: "Utdanningsprogram",
    resetSearch: "Sihko ohcama",
    heading: {
      heading: "Našunála digitála oahppanarena",
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
    title: "Tilgang nekta",
    errorDescription: "Du har ikke tilgang til denne sida",
  },
  collectionPage: {
    title: "Ressursar på {{language}}",
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
  treeStructure: {
    maxFoldersAlreadyAdded: "Vuollemáhpaid badjerádji lea olahuvvon",
    newFolder: {
      placeholder: "Čále nama máhppii",
      folderName: "Máhpa namma",
    },
  },
  competenceGoals: {
    competenceGoalTitle: "Mihttun lea ahte oahppi galgá máhttit:",
    licenseData: "Sisttisdoallá dáhta dán vuolde",
    licenseFrom: "biddjon olahanmuddui",
    competenceGoalResourceSearchText: "Vis ressursar til {{code}}",
    coreResourceSearchText: "Vis ressurser til kjerneelement {{code}}",
    competenceTabLK20label: "Gealbomihttomearri",
    competenceTabCorelabel: "Guovddášelemeanta",
    modalText: "Suokkar oahppoplánačanastagaid",
    showCompetenceGoals: "Čájet gealbomihttomeari",
    competenceGoalItem: {
      title: "Gealbomihttomearit ja árvvoštallan",
    },
  },
  subjectFrontPage: {
    buildsOn: "Duddjo dása",
    connectedTo: "Oktasaš prográmmafáddán lea",
    leadsTo: "Dát doalvu",
  },
  learningPath: {
    nextArrow: "Mana boahtte lávkái",
    previousArrow: "Mana ovddit lávkái",
    youAreInALearningPath: "Don leat dál muhtin oahppobálgás",
    lastStep: {
      heading: "Maŋemus ceahkki oahppobálgás",
      headingSmall: "Don leat dál oahppobálgá maŋemus ceahkis {{learningPathName}}",
      topicHeading: "Mana fáddái:",
      subjectHeading: "Mana fágii:",
    },
  },
  createdBy: {
    content: "Resursa",
    text: "lea vižžojuvvon",
  },
  tagSelector: {
    placeholder: "Čále fáddágilkora",
  },
  notFoundPage: {
    title: "Siidu ii gávdno",
    errorDescription: "Šállošat, eat gávnna siiddu masa geahččalit beassat.",
  },
  unpublishedResourcePage: {
    title: "Ressursen er avpublisert",
    errorDescription: "Beklager, ressursen du prøvde å komme til er avpublisert.",
  },
  messageBoxInfo: {
    noContent: "Mis ii dađibahábut leat makkárge prográmmafága vuos.",
    resources: "Dát ii leat ollislaš oahpponeavvu, muhto resursačoakkáldat man sávvat dutnje leat ávkin.",
    subjectOutdated: "Dát fága čuovvu oahppoplána mii ii gusto šat.",
    subjectBeta: "Dát fága lea betaveršuvnnas. Mii lasihit resurssaid dađistaga",
    frontPageExpired:
      "Ii leat oahpahus šat fágain mat eai leat gustovaččat, muhto sáhttá ain leat vejolaš váldit eksámena fágas privatistan.",
  },
  programmes: {
    header: "Maid háliidat oahppat odne?",
    description: "Vállje oahppoprográmma vai oainnát iežat fágaid",
    grades: "Ceahkki",
  },
  common: {
    subject_one: "Fága",
    subject_other: "Fágat",
  },
  resource: {
    noCoreResourcesAvailableUnspecific: "Ii leat makkárge guovddášávnnas olamuttus.",
    noCoreResourcesAvailable: "Ii leat guovddášávnnas čuovvovačča ovddas {{name}}.",
    activateAdditionalResources: "Lassiávnnas",
    label: "Oahppanresurssat",
    tooltipCoreTopic: "Guovddášávnnas",
    tooltipAdditionalTopic: "Lassiávnnas",
    additionalTooltip: "Lassiávnnas",
    trait: {
      audio: "Jietna",
      h5p: "Interaktiiva",
      podcast: "Podkásta",
      video: "Video",
    },
  },
  navigation: {
    additionalTopic: "Lassifáddá",
  },
  siteNav: {
    close: "Lukk søk",
  },
  labels: {
    other: "Eará",
  },
  multidisciplinarySubject: {
    subjectsLinksDescription: "Keisa mii gullá",
  },
  frontpageMenu: {
    allsubjects: "Buot fágat",
  },
  frontpageMultidisciplinarySubject: {
    text: "Oahppoplána golbma fágaidrasttideaddji fáttáin leat vuolggasadjin áigeguovdilis hástalusat servvodagas mat gáibidit beroštumi ja rahčamuša ovttaskas olbmuin ja searvevuođas lagasbirrasis, našunálalaččat ja máilmmeviidosaččat.",
  },
  footer: {
    vision: "Ovttas hábmet boahtteáiggi oahppama",
    linksHeader: "Oktavuohta",
    info: "Neahttabáiki lea ráhkaduvvon NDLA bokte rabas gáldokodain.",
    editorInChief: "Vásttolaš doaimmaheaddji:",
    availabilityLink: "Beasatlašvuođajulggaštus",
    privacyLink: "Persovdnasuodjalusjulggaštus ja diehtočoahkku (gáhkožat)",
    cookiesLink: "Julggaštus diehtočoahku ektui (gáhkožat)",
    aboutWebsite: "Neahttabáikki birra",
    followUs: "Čuovo min",
    socialMediaLinks: {
      facebook: "NDLA Facebookas",
      newsletter: "Dieđit iežat min ođasreivvii",
      youtube: "NDLA Youtubas",
      linkedin: "NDLA LinkedInas",
      instagram: "NDLA Instagramas",
    },
    ndlaLinks: {
      omNdla: "NDLA birra",
      aboutNdla: "NDLA birra",
      contact: "Kontakt oss",
    },
    otherLanguages: "Andre språk",
  },
  user: {
    loggedInAs: "Don leat sisaloggejuvvon {{role}}.",
    role: {
      employee: "bargi",
      student: "oahppi",
    },
    buttonLogIn: "Logge sisa Feide bokte",
    buttonLogOut: "Logge olggos",
    resource: {
      accessDenied: "Šállošat, muhto dát resursa lea dušše oahpaheddjiide mat leat loggen sisa Feide bokte.",
    },
    primarySchool: "váldoskuvla",
    name: "Namma",
    mail: "Eboasta",
    username: "Geavahan namma",
    wrongUserInfoDisclaimer:
      "Jus leat boasttudieđut, de ferte organisašuvdna/skuvlaeaiggát masá geavaheaddji gullá ođasmahttit dan. Visogova geavaheaddjidoarjaga ektui gávnnat dás: ",
  },
};

export default messages;
