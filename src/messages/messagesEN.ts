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
    forbidden: `Access denied - ${titleTemplate}`,
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
    learningpathsPage: `My learning paths - ${titleTemplate}`,
    learningpathPage: `{{name}}  - ${titleTemplate}`,
    learningpathEditStepsPage: `Edit steps - {{name}} - Learningpath - ${titleTemplate}`,
    learningpathEditTitlePage: `Edit title - {{name}} - Learningpath - ${titleTemplate}`,
    learningpathPreviewPage: `Preview - {{name}} - Learningpath - ${titleTemplate}`,
    learningpathSavePage: `Save - {{name}} - Learningpath - ${titleTemplate}`,
    learningpathNewPage: `New Learningpath - ${titleTemplate}`,
    collectionPage: `Resources in $t(languages.{{language}}) - ${titleTemplate}`,
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
      admin: {
        title: "The arena",
      },
      notification: {
        description:
          "Welcome to the arena for teachers in upper secondary education. This is <em>your</em> arena: a professional meeting place for discussion, inspiration, sharing, development, and collaboration.",
      },
      reported: "Content reported",
      error: "An error occured",
      userUpdated: "User updated",
      accept: {
        success: "You now have access to the arena",
        error: "Failed to accept the terms.",
        title: "Welcome to the arena",
        pitch1: "Here you can discuss and collaborate with teachers throughout Norway.",
        pitch2:
          "In the arena we are going to share and inspire each other - just remember to respect privacy and ensure that all content is legal!",
        listTitle: "In summary:",
        list1: "Don't share your own or others personally sensitive information",
        list2: "Make sure that what you are sharing is legal to share.",
        list3: "If you share content you have written yourself, others can reshare it as long as they quote you.",
        terms: "Read more in our terms of service.",
        privacyPolicy:
          "When you create a user in the NDLA Arena, we will process your personally sensitive information. You can read more about our usage of personally sensitive information in ",
        privacyPolicyLink: "our privacy policy",
        acceptButton: "Accept",
      },
    },
    goToMyNdla: "Go to My NDLA",
    learningpath: {
      newLearningpath: "New learningpath",
      editLearningpath: "Edit learningpath",
      editLearningpathTitle: "Edit learningpath title",
      form: {
        delete: "Delete",
        next: "Next",
        back: "Back",
        deleteStep: "Delete step",
        deleteBody: "Content cannot be restored",
        navigation: "Schemenavigation",
        title: {
          titleHelper: "Give the path a descriptive title",
          imageTitle: "Imagetitle",
          copyright: "Copyright",
          metaImage: "Metaimage",
          metaImageHelper: "Add a pciture that represents the learningpath",
          noResult: "No images matches your search query",
          imageRequired: "Please choose an image.",
        },
        content: {
          title: "Append content",
          resource: {
            label: "Article from NDLA",
            labelHelper: "Search for an article or paste a link",
          },
          text: {
            title: {
              label: "Title",
              labelHelper: "Create a descriptive title.",
            },
            introduction: {
              label: "Introduction",
              labelHelper: "Write a short introduction where you briefly summarize the content of your step.",
            },
            description: {
              label: "Content",
              labelHelper: "Write or paste your content here.",
            },
            copyright:
              "What you share in a learning path will be available under a Creative Commons license (BY-SA). This means that others can use and share what you have created, as long as they give you credit.",
            copyrightLink: "Read more about NDLA and content sharing here",
          },
          external: {
            title: {
              label: "Title",
              labelHelper: "Create a descriptive title.",
            },
            introduction: {
              label: "Introduction",
              labelHelper: "Write a short introduction where you briefly summarize the content of your step.",
            },
            content: {
              label: "Content from another website",
              labelHelper: "Paste a link to the content you want to add.",
            },
            copyright:
              "When you share content from other websites, you are responsible for ensuring that the content is legal to share. Learn more about ",
            copyrightLink: "copyright and sharing.",
            checkbox: "The content I have linked to is legal to share.",
          },
          folder: {
            label: "Search in My Folders",
            labelHelper: "Select content from my folders",
          },
        },
        options: {
          text: "Text written by myself",
          resource: "Content from NDLA",
          external: "Content from a external website",
          folder: "Content from one of my folder in My NDLA",
        },
        steps: {
          next: "Neste: {{ next }}",
          title: "Title and description",
          content: "Append content",
          preview: "Preview",
          save: "Save and share",
          edit: "Edit step",
          add: "Add step",
        },
      },
      title: "My Learning Paths",
      description:
        "Here you can create your own learning paths and share them with your students. The learning paths can include articles from NDLA, links to other resources, and short texts you create yourself.",
      created: "Created: {{ created }}",
      shared: "Shared: {{ shared }}",
      noPath: "You haven't created any learning paths yet. Click the <em>Add</em> button to start creating one",
      menu: {
        new: "New",
        edit: "Edit",
        delete: "Delete",
        share: "Share",
        unShare: "Stop Sharing",
        goTo: "Go to",
        copy: "Copy Link",
      },
      toast: {
        deleted: 'The learning path "{{ name }}" has been deleted.',
        unshared: 'The learning path "{{ name }}" is no longer shared.',
        unshareFailed: "Failed to unshare the learning path.",
        shared: "The learning path is shared.",
        shareFailed: "Failed to share the learning path.",
        copy: 'Copied the link to the learning path "{{ name }}"',
      },
      status: {
        shared: "Shared",
        readyForSharing: "Ready to Share",
        private: "Started",
      },
      delete: {
        title: "Delete learning path",
        body: "Are you sure you want to delete the learning path? This action cannot be undone.",
        button: "Delete learning path",
      },
      sharing: {
        title: "This learning path is shared",
        description: {
          shared:
            "When you share a learning path, you create a link that is accessible to anyone with the link. You can edit the content or stop sharing it whenever you want.",
          private:
            "Now you can share this link with students or other teachers. If you make changes to the learning path, they will be visible to everyone you’ve shared the link with.",
          copy: "Click the link to copy it",
        },
        link: "Copy Link",
        copied: "The link has been copied",
        button: {
          done: "Done",
          preview: "Preview learning path",
        },
      },
      saveLearningpath: {
        saveAndClose: "Save and close",
        pageHeading: "Save and share",
        pageDescription:
          "Save and share your learning path. When you share the learning path, you create a link that can be shared with students or teachers.",
      },
      previewLearningpath: {
        pageHeading: "Preview",
        pageDescription: "Preview the learning path you have created.",
        noSteps: "You haven't added any steps to the learning path yet.",
      },
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
      introduction: "Introduction",
      url: "Link",
      shareable: "Able to share",
    },
    required: "This field is required",
    requiredField: "$t(validation.fields.{{field}}) can not be empty",
    notUnique: "Already exists",
    maxLength: "This field can only contain {{count}} characters",
    maxLengthField: `$t(validation.fields.{{field}}) can only contain {{count}} characters`,
    properUrl: "This field can only contain a valid link. E.g: https://ndla.no",
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
    externalWarning:
      "This learning path has been developed by an external teacher, who holds the editorial responsibility. Please note that it may contain texts and links that do not originate from ndla.no.",
    externalLink: "Open in a new window",
  },
  movedResourcePage: {
    title: "The page has moved, but you can find it here:",
    openInSubject: "Open the article in a subject:",
  },
  forbiddenPage: {
    title: "Access denied",
    errorDescription: "You do not have access to this page.",
  },
  collectionPage: {
    title: `Resources in $t(languages.{{language}})`,
    noSubjects: "We do not have any resources in this language yet.",
  },
  date: {
    ago: "ago",
    now: "Just now",
    units: {
      day: "day",
      days: "days",
      hour: "hour",
      hours: "hours",
      minute: "minute",
      minutes: "minutes",
      month: "month",
      months: "months",
      second: "second",
      seconds: "seconds",
      year: "year",
      years: "years",
    },
  },
};

export default messages;
