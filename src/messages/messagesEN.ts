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
    aboutPage: `{{name}} - ${titleTemplate}`,
  },
  footer: {
    cookiesLink: 'Statement about cookies',
  },
  programmes: {
    header: 'What do you want to learn today?',
    description: 'Choose a programme to see your subjects',
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
    linkText: 'View tips',
    ingress:
      'See our tips for activities and annual plans. Good results start with good planning.',
  },
  myndla: {
    campaignBlock: {
      title: 'Try our chatbot',
      linkText: 'Try NDLAs chatbots',
      ingressStudent:
        'Are you wondering about anything in your course? Do you need help simplifying a text, practicing for a test, or getting suggestions for an outline? Try our chatbot and see if it can help you out! During exams the county may deny access to the chatbots.',
      ingress:
        'Do you want to use AI in your teaching? NDLA has created two chatbots that protect your privacy and can be safely used for work and in teaching. During exams the county may deny access to the chatbots.',
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
  lti: {
    goBack: 'Go back to LTI search',
  },
  resourcepageTitles: {
    video: 'Video',
    image: 'Image',
    concept: 'Concept',
    audio: 'Audio',
  },
  markdownEditor: {
    link: {
      url: 'Link',
      error: {
        empty: 'Link must not be empty',
        invalid: 'Invalid link. Follow the format https://ndla.no',
      },
    },
    toolbar: {
      bold: {
        active: 'Remove bold formatting',
        inactive: 'Add bold formatting',
      },
      italic: {
        active: 'Remove italic formatting',
        inactive: 'Add italic formatting',
      },
      unorderedList: {
        active: 'Remove unordered list',
        inactive: 'Add unordered list',
      },
      orderedList: {
        active: 'Remove ordered list',
        inactive: 'Add ordered list',
      },
      link: {
        active: 'Remove link',
        inactive: 'Add link',
        noSelection: 'Select text to add link',
      },
    },
  },
};

export default messages;
