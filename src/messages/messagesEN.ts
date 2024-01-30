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
    arenaPage: `Arena - ${titleTemplate}`,
    arenaTopicPage: `{{name}} - Arena - ${titleTemplate}`,
    arenaPostPage: `{{name}} - Arena - ${titleTemplate}`,
    arenaNewTopicPage: `New post - Arena - ${titleTemplate}`,
  },
  podcastPage: {
    episodes: 'Episodes',
    podcast: 'Podcast',
    podcasts: 'Podcasts',
    pageInfo: 'Page {{page}} of {{lastPage}}',
    noResults: '...No episodes',
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
  myNdla: {
    arena: {
      notification: {
        description:
          'Welcome to the arena for teachers in upper secondary education. This is <em>your</em> arena: a professional meeting place for discussion, inspiration, sharing, development, and collaboration.',
      },
    },
  },
  validation: {
    fields: {
      name: 'Name',
      description: 'Description',
      title: 'Title',
      content: 'Content',
    },
    required: 'This field is required',
    requiredField: '$t(validation.fields.{{field}}) can not be empty',
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
      url: 'URL',
      text: 'Text',
      error: {
        url: {
          empty: 'Link URL must not be empty',
          invalid: 'Invalid link URL. Follow the format https://ndla.no',
        },
        text: {
          empty: 'Link text must not be empty',
        },
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
      },
    },
  },
};

export default messages;
