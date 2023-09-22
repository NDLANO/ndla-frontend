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
  },
  programmes: {
    header: 'Hva vil du lære om i dag?',
    description: 'Velg utdanningsprogram for å se dine fag',
  },
  podcastPage: {
    episodes: 'Episoder',
    podcast: 'Podkast',
    podcasts: 'Podkaster',
    pageInfo: 'Side {{page}} av {{lastPage}}',
    noResults: '...Ingen episoder',
  },
  sharedFolder: 'Delt mappe',
  campaignBlock: {
    title: 'Planlegg skoleåret med NDLA',
    linkText: 'Se forslag',
    ingress:
      'Se våre forslag til aktiviteter og årsplaner. Gode resultater starter med god planlegging.',
  },
  validation: {
    fields: {
      name: 'Navn',
      description: 'Beskrivelse',
    },
    required: 'Dette feltet er påkrevd',
    requiredField: '$t(validation.fields.{{field}}) er påkrevd',
    notUnique: 'Finnes allerede',
    maxLength: 'Dette feltet kan maks inneholde {{count}} tegn',
    maxLengthField:
      '$t(validation.fields.{{field}}) kan maks innholde {{count}} tegn',
  },
  resourcepageTitles: {
    video: 'Video',
    image: 'Bilde',
    audio: 'Audio',
    concept: 'Forklaring',
  },
};

export default messages;
