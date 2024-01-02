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
    welcomePage: `Forsiden - ${titleTemplate}`,
    topicPage: 'Emne',
    subjectsPage: `Alle fag - ${titleTemplate}`,
    searchPage: `Søk - ${titleTemplate}`,
    notFound: `Siden finnes ikke - ${titleTemplate}`,
    accessDenied: `Ingen tilgang - ${titleTemplate}`,
    subject: 'Fag',
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
      title: 'Prøv vår praterobot',
      linkText: 'Prøv NDLAs prateroboter',
      ingressStudent:
        'Lurer du på noe i faget ditt? Vil du ha hjelp til å forenkle en tekst, øve til en prøve eller få forslag til en disposisjon? Prøv prateroboten vår og se om den kan hjelpe deg! I perioder med eksamensgjennomføring kan det hende fylkeskommunen stenger tilgangen til praterobotene.',
      ingress:
        'Vil du bruke KI i undervisninga? NDLA har laget to prateroboter som tar vare på personvernet ditt og trygt kan brukes til jobb og i undervisning. I perioder med eksamensgjennomføring kan det hende fylkeskommunen stenger tilgangen til praterobotene.',
    },
  },
  validation: {
    fields: {
      name: 'Navn',
      description: 'Beskrivelse',
      title: 'Tittel',
      content: 'Innhold',
    },
    required: 'Dette feltet er påkrevd',
    requiredField: '$t(validation.fields.{{field}}) er påkrevd',
    notUnique: 'Finnes allerede',
    maxLength: 'Dette feltet kan maks inneholde {{count}} tegn',
    maxLengthField:
      '$t(validation.fields.{{field}}) kan maks innholde {{count}} tegn',
  },
  lti: {
    goBack: 'Tilbake til LTI-søk',
  },
  resourcepageTitles: {
    video: 'Video',
    image: 'Bilde',
    audio: 'Audio',
    concept: 'Forklaring',
  },
  markdownEditor: {
    link: {
      url: 'Lenke',
      error: {
        empty: 'Lenka kan ikke være tom',
        invalid: 'Ugyldig lenke. Følg formatet https://ndla.no',
      },
    },
    toolbar: {
      bold: {
        active: 'Fjern fet skrift',
        inactive: 'Legg til fet skrift',
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
