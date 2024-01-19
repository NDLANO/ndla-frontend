/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const titleTemplate = 'NDLA';

const messages = {
  htmlTitles: {
    titleTemplate,
    welcomePage: `Framsida - ${titleTemplate}`,
    topicPage: 'Emne',
    subjectsPage: `Alle fag - ${titleTemplate}`,
    searchPage: `Søk - ${titleTemplate}`,
    notFound: `Sida finst ikkje - ${titleTemplate}`,
    accessDenied: `Ingen tilgang - ${titleTemplate}`,
    subject: 'Fag',
    podcast: `Podkast - Side {{page}} - ${titleTemplate}`,
    lti: `LTI - ${titleTemplate}`,
    movedResourcePage: `Sida har flytta - ${titleTemplate}`,
    myNdlaPage: `Min NDLA - ${titleTemplate}`,
    myFoldersPage: `Mine mapper - ${titleTemplate}`,
    myFolderPage: `{{folderName}} - ${titleTemplate}`,
    myTagPage: `#{{tag}} - ${titleTemplate}`,
    myTagsPage: `Mine emneknagger - ${titleTemplate}`,
    sharedFolderPage: `{{name}} - ${titleTemplate}`,
    aboutPage: `{{name}} - ${titleTemplate}`,
    arenaPage: `Arena - ${titleTemplate}`,
    arenaTopicPage: `{{name}} - Arena - ${titleTemplate}`,
    arenaPostPage: `{{name}} - Arena - ${titleTemplate}`,
    arenaNewTopicPage: `Nytt innlegg - Arena - ${titleTemplate}`,
  },
  podcastPage: {
    episodes: 'Episoder',
    podcast: 'Podkast',
    podcasts: 'Podkaster',
    pageInfo: 'Side {{page}} av {{lastPage}}',
    noResults: '...Ingen episoder',
  },
  myndla: {
    campaignBlock: {
      title: 'Prøv praterobotane våre',
      linkText: 'Prøv NDLAs praterobotar',
      ingressStudent:
        'Lurer du på noko i faget ditt? Vil du ha hjelp til å forenkle ein tekst, øve til ein prøve eller få forslag til ein disposisjon? Prøv prateroboten vår og sjå om han kan hjelpe deg! I periodar med eksamensgjennomføring kan det hende fylkeskommunen stenger tilgangen til praterobotane.',
      ingress:
        'Vil du bruke KI i undervisninga? NDLA har laga to praterobotar som tek vare på personvernet ditt og trygt kan brukast til jobb og i undervisning. I periodar med eksamensgjennomføring kan det hende fylkeskommunen stenger tilgangen til praterobotane.',
    },
  },
  validation: {
    fields: {
      name: 'Namn',
      title: 'Tittel',
      content: 'Innhald',
      description: 'Beskriving',
    },
    required: 'Dette feltet er påkrevd',
    requiredField: '$t(validation.fields.{{field}}) er påkrevd',
    notUnique: 'Finnes allereie',
    maxLength: 'Dette feltet kan maks innehalde {{count}} teikn',
    maxLengthField:
      '$t(validation.fields.{{field}}) kan maks innehalde {{count}} teikn',
  },
  lti: {
    goBack: 'Tilbake til LTI-søk',
  },
  resourcepageTitles: {
    video: 'Video',
    image: 'Bilde',
    concept: 'Forklaring',
    audio: 'Audio',
  },
  markdownEditor: {
    link: {
      url: 'Lenke',
      error: {
        empty: 'Lenka kan ikkje vere tom!',
        invalid: 'Ugyldig lenke. Følg formatet https://ndla.no',
      },
    },
    toolbar: {
      bold: {
        active: 'Fjern feit skrift',
        inactive: 'Legg til feit skrift',
      },
      italic: {
        active: 'Fjerne kursiv skrift',
        inactive: 'Legg til kursiv skrift',
      },
      unorderedList: {
        active: 'Fjern punktliste',
        inactive: 'Legg til punktliste',
      },
      orderedList: {
        active: 'Fjern nummerert liste',
        inactive: 'Legg til nummerert liste',
      },
      link: {
        active: 'Fjern lenke',
        inactive: 'Legg til lenke',
        noSelection: 'Marker tekst for å legge til lenke',
      },
    },
  },
};

export default messages;
