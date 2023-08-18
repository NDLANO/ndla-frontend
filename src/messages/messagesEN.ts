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
    welcomePage: `Frontpage - ${titleTemplate}`,
    topicPage: 'Topic',
    subjectsPage: `All subjects - ${titleTemplate}`,
    searchPage: `Search - ${titleTemplate}`,
    notFound: `Page not found - ${titleTemplate}`,
    accessDenied: `Access denied - ${titleTemplate}`,
    subject: 'Subject',
    podcast: `Podcast - Page {{page}} - ${titleTemplate}`,
    lti: `LTI - ${titleTemplate}`,
    movedResourcePage: `The page has been moved - ${titleTemplate}`,
    myNdlaPage: `My NDLA - ${titleTemplate}`,
    myFoldersPage: `My folders - ${titleTemplate}`,
    myFolderPage: `{{folderName}} - ${titleTemplate}`,
    myTagPage: `#{{tag}} - ${titleTemplate}`,
    myTagsPage: `My tags - ${titleTemplate}`,
    sharedFolderPage: `{{name}} - ${titleTemplate}`,
    aboutPage: `{{name}} - About NDLA - ${titleTemplate}`,
  },
  podcastPage: {
    episodes: 'Episodes',
    podcast: 'Podcast',
    podcasts: 'Podcasts',
    pageInfo: 'Page {{page}} of {{lastPage}}',
    noResults: '...No episodes',
  },
  sharedFolder: 'Shared folder',
  campaignBlock: {
    title: 'Make plans for the school year with NDLA',
    linkText: 'Read more',
    ingress:
      'See our tips for activities and annual plans. Good results start with good planning.',
  },
  blogPosts: {
    blog1: {
      imageUrl: '/static/samiske-laeremidler.jpg',
      text: 'Utvikler samiske ressurser på NDLA',
      externalLink:
        'https://blogg.ndla.no/2023/02/utvikler-samiske-ressurser-pa-ndla/',
      linkText: 'Fagblogg',
      license: 'CC-BY-SA-4.0',
      licenseAuthor: 'Jan Frode Lindsø',
    },
    blog2: {
      imageUrl: '/static/aktiviser-elevene.jpg',
      text: 'Huskeliste for kontaktlærere',
      externalLink:
        'https://blogg.ndla.no/2019/08/huskeliste-for-kontaktlaerere/',
      linkText: 'Fagblogg',
      license: 'CC-BY-SA-4.0',
      licenseAuthor: 'Tom Knudsen',
    },
  },
  validation: {
    fields: {
      name: 'Name',
      description: 'Description',
    },
    required: 'This field is required',
    requiredField: '$t(validation.fields.{{field}}) is required',
    notUnique: 'Already exists',
    maxLength: 'This field can only contain {{count}} characters',
    maxLengthField: `$t(validation.fields.{{field}}) can only contain {{count}} characters`,
  },
  resourcepageTitles: {
    video: 'Video',
    image: 'Image',
    concept: 'Concept',
    audio: 'Audio',
  },
};

export default messages;
