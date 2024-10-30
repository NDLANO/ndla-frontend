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
    welcomePage: `Frontpage - ${titleTemplate}`,
    topicPage: "Topic",
    subjectsPage: `All subjects - ${titleTemplate}`,
    searchPage: `Search - ${titleTemplate}`,
    notFound: `Page not found - ${titleTemplate}`,
    unpublished: `Resource is unpublished - ${titleTemplate}`,
    accessDenied: `Access denied - ${titleTemplate}`,
    subject: "Subject",
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
    arenaAdminPage: `Administrate Arena - ${titleTemplate}`,
    arenaTopicPage: `{{name}} - Arena - ${titleTemplate}`,
    arenaPostPage: `{{name}} - Arena - ${titleTemplate}`,
    arenaNewTopicPage: `New post - Arena - ${titleTemplate}`,
    arenaNewCategoryPage: `New category - Arena - ${titleTemplate}`,
  },
  menu: {
    about: "About us",
    subjectAndProgramme: "Courses and programmes",
    tipsAndAdvice: "Tools and advice",
    goBack: "Go back",
  },
  podcastPage: {
    meta: "Listen and learn! NDLA offers more than 100 freely available podcasts for engaging use in upper secondary education.",
    episodes: "Episodes",
    podcast: "Podcast",
    podcasts: "Podcasts",
    noResults: "...No episodes",
    subtitle: "Listen and learn!",
    pagination: "Podcast pages",
  },
  subjectsPage: { tabFilter: { label: "Which subjects would you like to show?", all: "All subjects and resources" } },
  searchPage: {
    title: "Search on ndla.no",
    filterSearch: "Filter your search results:",
    subjectLetter: "Subjects starting with {{letter}}",
    resourceTypeFilter: "Resource types",
  },
  myndla: {
    tagsTitle: "My tags",
    campaignBlock: {
      title: "Try our chatbots",
      linkText: "Try NDLAs chatbots",
      ingressStudent:
        "Are you wondering about anything in your course? Do you need help simplifying a text, practicing for a test, or creating illustrations? Try our chatbots and see if they can help you out! During exams the counties may deny access to the chatbots.",
      ingress:
        "Do you want to use AI in your teaching? NDLA has created chatbots that protect your privacy and can be safely used for work and in teaching. During exams the counties deny access to the chatbots.",
      ingressUnauthenticated:
        "Do you want to use AI in your teaching? NDLA has created chatbots that protect your privacy and can be safely used for work and in teaching. During exams the counties deny access to the chatbots. Log in to to access the chatbots.",
    },
    resource: {
      addedToFolder: 'Resource added to "{{folder}}"',
      added: "Added",
      removed: "Removed",
      showTags: "Show tags",
      tagsDialogTitle: "Tags related to resource {{title}}",
      noTags: "No tags.",
    },
  },
  myNdla: {
    sharedFolder: {
      learningpathUnsupportedTitle: "Learning paths are not supported",
      resourceRemovedTitle: "Resource not available",
    },
    arena: {
      notification: {
        description:
          "Welcome to the arena for teachers in upper secondary education. This is <em>your</em> arena: a professional meeting place for discussion, inspiration, sharing, development, and collaboration.",
      },
      reported: "Content reported",
      error: "An error occured",
      userUpdated: "User updated",
    },
  },
  ndlaFilm: {
    films: "Films",
    topics: "Topics",
    filterFilms: "Filter films",
  },
  validation: {
    fields: {
      name: "Name",
      description: "Description",
      title: "Title",
      content: "Content",
    },
    required: "This field is required",
    requiredField: "$t(validation.fields.{{field}}) can not be empty",
    notUnique: "Already exists",
    maxLength: "This field can only contain {{count}} characters",
    maxLengthField: `$t(validation.fields.{{field}}) can only contain {{count}} characters`,
  },
  lti: {
    goBack: "Go back to LTI search",
  },
  resourcepageTitles: {
    video: "Video",
    image: "Image",
    concept: "Concept",
    audio: "Audio",
  },
  contentTypes: {
    multidisciplinary: "Multidisciplinary case",
  },
  markdownEditor: {
    link: {
      url: "URL",
      text: "Text",
      error: {
        url: {
          empty: "Link URL must not be empty",
          invalid: "Invalid link URL. Follow the format https://ndla.no",
        },
        text: {
          empty: "Link text must not be empty",
        },
      },
    },
    toolbar: {
      bold: {
        active: "Remove bold formatting",
        inactive: "Add bold formatting",
      },
      italic: {
        active: "Remove italic formatting",
        inactive: "Add italic formatting",
      },
      unorderedList: {
        active: "Remove unordered list",
        inactive: "Add unordered list",
      },
      orderedList: {
        active: "Remove ordered list",
        inactive: "Add ordered list",
      },
      link: {
        active: "Remove link",
        inactive: "Add link",
      },
    },
  },
  multidisciplinary: {
    casesCount: "{{count}} cases",
  },
  tabs: {
    competenceGoals: "Categories",
    licenseBox: "Content types",
    subjectFilter: "Subject categories",
  },
  masthead: {
    search: "Search ndla.no",
    moreHits: "See more results",
  },
  pagination: { next: "Next", prev: "Previous" },
  programmePage: {
    programmeSubjects: "Programme subjects",
  },
  aboutPage: {
    nav: "Information pages",
  },
  subjectPage: {
    topicsTitle: "Topics in {{topic}}",
  },
  welcomePage: {
    programmes: "Programmes",
  },
  learningpathPage: {
    accordionTitle: "Learning path content",
    learningsteps: "Steps",
    stepCompleted: "Completed",
  },
  movedResourcePage: {
    title: "The page has moved, but you can find it here:",
    openInSubject: "Open the article in a subject:",
  },
};

export default messages;
