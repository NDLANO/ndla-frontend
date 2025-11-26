/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const titleTemplate = "NDLA";

const messages = {
  languages: {
    // Adds to list from frontend-packages
    ar: "Arabic",
    la: "Latin",
    no: "Norwegian",
    so: "Somali",
    ti: "Tigrinya",
    und: "Undetermined",
    ukr: "Ukranian",
    prs: "Dari",
    san: "Sanskrit",
    heb: "Hebrew",
    pli: "Pali",
  },
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
    learningpathsPage: `My learning paths - ${titleTemplate}`,
    learningpathPage: `{{name}}  - ${titleTemplate}`,
    learningpathEditStepsPage: `Edit steps - {{name}} - Learningpath - ${titleTemplate}`,
    learningpathEditTitlePage: `Edit title - {{name}} - Learningpath - ${titleTemplate}`,
    learningpathPreviewPage: `Preview - {{name}} - Learningpath - ${titleTemplate}`,
    learningpathSavePage: `Save - {{name}} - Learningpath - ${titleTemplate}`,
    learningpathNewPage: `New Learningpath - ${titleTemplate}`,
    collectionPage: `Resources in $t(languages.{{language}}) - ${titleTemplate}`,
    errorPage: `An error occurred - ${titleTemplate}`,
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
  subjectsPage: {
    tabFilter: {
      label: "Which subjects would you like to show?",
      all: "All subjects and resources",
    },
    subcategory: "Filter subjects",
    myFavoriteSubjects: "Your favorite subjects",
    subjectGroup: 'Group "{{ category }}"',
    scrollToGroup: "Scroll to group",
    errorDescription: "Sorry, an error occurred while loading the subjects.",
    allSubjects: "All subjects",
    alphabeticSort: "Subjects grouped alphabetically",
    addConfirmed: "{{subject}} is added to your favorite subjects",
    removeConfirmed: "{{subject}} is removed from your favorite subjects",
    addFavorite: "Add favorite subject",
    removeFavorite: "Remove favorite subject",
    confirmRemove: "Are you sure you want to remove {{subject}} from your favorite subjects?",
    subjectFavoritePitch: "Do you want to favorite this subject?",
    subjectFavoriteGuide:
      "To favorite a subject you must log in to My NDLA. You will find the subject on the top of this page after logging in.",
  },
  topicsPage: {
    topics: "Topics",
    multidisciplinaryLinksHeader: "Work multidisciplinary with the topic",
  },
  searchPage: {
    title: "Search on ndla.no",
    subjectLetter: "Subjects starting with {{letter}}",
    pagination: "Search results",
    querySuggestion: "Search instead for ",
    showingResults: {
      hits: "Showing results {{from}}-{{to}} of {{total}}",
      query: "for",
      noHits: "No results",
    },
    traits: {
      VIDEO: "Video",
      AUDIO: "Audio",
      H5P: "Interactive content",
      PODCAST: "Podcast",
    },
    context: {
      dialogTrigger: "+ {{count}} more contexts",
      dialogHeading: "The resource is used in several contexts",
    },
    filtersHeading: "Customize your search",
    subjectFilter: {
      heading: "Filter by subject",
      trigger: "Choose subject",
      dialogTitle: "Filter search",
      removeFilter: "Remove {{subject}}",
    },
    traitFilter: {
      heading: "Show pages with",
    },
    grepFilter: {
      heading: "Filter by competence goals",
      removeFilter: "Remove {{code}}",
    },
    resourceTypeFilter: {
      title: "Choose page type",
      showSubtypes: "Show subtypes for {{parent}}",
      resourceLabel: "Resource",
      subjectLabel: "Subject",
      topicLabel: "Topic",
      allLabel: "Show all",
      hits: "{{count}} hits",
    },
    programmeFilter: { title: "Choose programme" },
    noHitsShort: "No results for search: {{query}}",
    search: "Search",
    searchFieldPlaceholder: "Search for subjects, tasks and activities or learningpaths",
    searchFieldPlaceholderShort: "Search",
    searchResultListMessages: {
      noResultHeading: "Hmm, no content ...",
      noResultDescription:
        "Unfortunately, we do not have anything to offer here. If you want to suggest any content for this site, you can use Ask NDLA, located at the bottom right of the screen.",
    },
    searchFilterMessages: {
      coreRelevance: "Core content",
      supplementaryRelevance: "Supplementary content",
    },
    resultType: {
      showingSearchPhrase: "Showing hits for",
    },
  },
  myNdla: {
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
      added: "Added",
      addedFailed: "Failed to add resource",
      removed: "Removed",
      showTags: "Show tags",
      tagsDialogTitle: "Tags related to resource {{title}}",
      noTags: "No tags.",
      add: "Add folder/tag",
      remove: "Remove",
      removeTitle: "Remove resource",
      confirmRemove: "Are you sure you want to remove the resource from this folder?",
      copyLink: "Copy link to this page",
      linkCopied: "Copied to clipboard",
      addToMyNdla: "Add to My NDLA",
      addedToMyNdla: "Added to My NDLA",
      copyToMyNdla: "Copy to My NDLA",
      addedToFolder: "Resource added to ",
      removedFromFolder: 'Removed from "{{folderName}}"',
      removedFromFolderFailed: 'Could not remove resource from folder "{{ folderName }}"',
      titleUpdated: "Title updated",
      tagsUpdated: "Tags updated",
      tagsUpdatedFailed: "Failed to update tags",
      show: "Show",
      save: "Save resource",
      onDragStart: "Picked up the resource {{name}}. The resource is in position {{index}} of {{length}}",
      onDragOver: "The resource {{name}} was moved into position {{index}} of {{length}}",
      onDragOverMissingOver: "The resource {{name}} is no longer over a droppable area",
      onDragEnd: "The resource {{name}} was dropped at position {{index}} og {{length}}",
      onDragEndMissingOver: "The resource {{name}} was dropped",
      onDragCancel: "Dragging was cancelled. The resource {{name}} was dropped",
      dragHandle: "Drag the resource {{name}}",
    },
    sharedFolder: {
      learningpathUnsupportedTitle: "Learning paths are not supported",
      resourceRemovedTitle: "Resource not available",
      folderCopied: "The folder was copied.",
      info: "This folder contains learning resources and tasks from NDLA, gathered by a teacher.",
      shared: "This folder contains learning resources and tasks from NDLA, gathered by {{sharedBy}}.",
      aTeacher: "a teacher",
      firstShared: "The folder was shared for the first time {{date}}",
      learningpathUnsupported:
        "Learning paths and multidisciplinary cases cannot be shown directly in a shared folder. You can open the learning path in a new tab by clicking the link in the navigation menu to the left.",
      drawerButton: "Show folders and resources",
      drawerTitle: "Folders and resources",
      description:
        "In this folder you find articles and tasks from NDLA. The articles have been collected and placed in order by a teacher.",
      willOpenInNewTab: "Opens in a new tab.",
    },
    acceptedShareName: {
      title: "Now we show your name when you share",
      subtitle:
        "We have changed the display of shared folders. Your name is now shown on all shared folders and learning paths.",
      description: "If you do not want your name to be visible, you can stop sharing folders and learning paths.",
      button: "OK",
      accept: {
        error: "Could not save",
      },
    },
    arena: {
      title: "The arena",
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
    learningpathstep: {
      onDragStart:
        "Picked up the learningpath step {{name}}. The learningpath step is in position {{index}} of {{length}}",
      onDragOver: "The learningpath step {{name}} was moved into position {{index}} of {{length}}",
      onDragOverMissingOver: "The learningpath step {{name}} is no longer over a droppable area",
      onDragEnd: "The learningpath step {{name}} was dropped at position {{index}} of {{length}}",
      onDragEndMissingOver: "The learningpath step {{name}} was dropped",
      onDragCancel: "Dragging was cancelled. The learningpath step {{name}} was dropped",
      dragHandle: "Drag the learningpath step {{name}}",
      error: "Something went wrong while moving the learningpath step",
    },
    learningpath: {
      newLearningpath: "New learningpath",
      editLearningpath: "Edit learningpath",
      editLearningpathTitle: "Edit learningpath title",
      alert: {
        title: "You have unsaved changes in the form",
        content: "You have unsaved changes in the form. If you continue all changes will be lost.",
        continue: "Continue",
        cancel: "Cancel",
      },
      form: {
        delete: "Delete",
        next: "Proceed",
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
        metadata: {
          title: "Meta data",
          introductionHelper: "This content will be displayed on the front page of your learning path",
        },
        content: {
          title: "Append content",
          resource: {
            label: "Article from NDLA",
            labelHelper: "Search for an article",
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
              "Everything you write in a learning path on NDLA will be available under the license CC BY-SA. This means that others can use, adapt and share what you have created, as long as they give you credit.",
            copyrightLink: "Read more about NDLA and content sharing here",
            editingDisabled: {
              message:
                "This text is written by someone other than you. You can therefore not edit it. If you want to, you can delete this and create a new step.",
            },
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
            noResources: "You haven't added any resources to your folders yet.",
            label: "Search in My Folders",
            labelHelper: "Select content from your folders",
            placeholder: "Search for resources that are stored in your folders.",
            error: "Something went wrong while fetching resources",
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
          title: "Title",
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
        clone: "Copy Learning Path",
      },
      toast: {
        createdFailed: "Could not create learningpath.",
        deleted: 'The learning path "{{ name }}" has been deleted.',
        deletedFailed: 'Deleting the learning path "{{ name }}" failed.',
        unshared: 'The learning path "{{ name }}" is no longer shared.',
        unshareFailed: "Failed to unshare the learning path.",
        shared: "The learning path is shared.",
        shareFailed: "Failed to share the learning path.",
        copy: 'Copied the link to the learning path "{{ name }}".',
        cloned: 'Copied the learning path to "{{ name }}".',
        updateStepFailed: 'Updating step with title "{{ name }}" failed.',
        createdStep: 'A step with title "{{ name }}" was created.',
        deletedStep: 'A step with title "{{ name }}" was deleted.',
        deletedStepFailed: 'Could not delete step with title "{{ name }}".',
        createdStepFailed: 'Could not create step with title "{{ name }}".',
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
          "Save and share your learning path. When you share a learning path, you create a shareable link that you can send to students or teachers. The learning path will be available for anyone who has the link. You can change the learning path's content or stop the sharing when you wish.",
      },
      previewLearningpath: {
        pageHeading: "Preview",
        pageDescription: "Preview the learning path you have created.",
        noSteps: "You haven't added any steps to the learning path yet.",
      },
      copy: {
        title: "Copy learning path",
        description:
          "By copying a learning path, it is added to your list of learning paths. You can then edit and customize the path as you wish.",
        button: "Copy to my learning paths",
        success: { title: "Copied", description: "The learning path is copied to " },
        error: "Something went wrong while copying the learning path",
        loginCopyPitch: "Do you want to copy this learning path?",
      },
    },

    description:
      "My NDLA: Organize the content your way! Use NDLA’s chat robot (AI). Save and share with colleagues and students.",
    mainMenu: "Main menu",
    myNDLA: "My NDLA",
    myNDLAMenu: "My NDLA menu",
    support: "Support",
    resources_one: "{{count}} Resource",
    resources_other: "{{count}} Resources",
    folders_one: "{{count}} Folder",
    folders_other: "{{count}} Folders",
    settings: "Settings",
    showEditOptions: "Show editing options",
    folder: {
      folder: "Folder",
      navigation: "Folder navigation",
      delete: "Delete folder",
      deleteShort: "Delete",
      edit: "Edit folder",
      editShort: "Edit",
      copy: "Copy folder",
      open: "Open folder",
      close: "Close folder",
      updated: "Folder updated",
      updatedFailed: 'Failed to update folder "{{ name }}"',
      defaultPageDescription: "Add a description by editing the folder",
      missingName: "Folder name required",
      folderDeleted: '"{{folderName}}" deleted',
      folderDeletedFailed: 'Failed to delete folder "{{folderName}}"',
      folderCreated: '"{{folderName}}" created',
      folderCreatedFailed: 'Failed to create folder "{{folderName}}"',
      folderCopied: "Folder have been copied to {{folderName}}",
      folderCopiedFailed: "Failed to copy folder {{folderName}}",
      onDragStart: "Picked up the folder {{name}}. The folder is in position {{index}} of {{length}}",
      onDragOver: "The folder {{name}} was moved into position {{index}} of {{length}}",
      onDragOverMissingOver: "The folder {{name}} is no longer over a droppable area",
      onDragEnd: "The folder {{name}} was dropped at position {{index}} of {{length}}",
      onDragEndMissingOver: "The folder {{name}} was dropped",
      onDragCancel: "Dragging was cancelled. The folder {{name}} was dropped",
      dragHandle: "Drag the folder {{name}}",
      professional: "a professional",
      sharedWarning: "Name and description will be visible for everyone you share the folder with",
      sharing: {
        share: "Share folder",
        shared: "Shared",
        sharedBy: "Shared by ",
        sharedByAnonymous: "anonymous teacher",
        sharedFolder: "Shared folder",
        unShare: "Sharing stopped. The folder is no longer shared.",
        unShareFailed: "Failed to stop sharing the folder. The folder is still shared.",
        copyLink: "Copy link to folder",
        removeLink: "Remove link to folder",
        link: "Link is copied",
        savedLink: "Link to {{ name }} has been added to My folders.",
        savedLinkFailed: "Failed to add Link to {{name}} to My folders.",
        unSavedLink: "Link to {{ name }} has been removed from My folders.",
        unSavedLinkFailed: "Failed to remove link from My folders.",
        sharedHeader: "This folder is shared",
        folderShared: "This folder is shared.",
        folderSharedFailed: "Unsuccessful to share this folder.",
        description: {
          copy: "Press the link to copy",
          private:
            "When you share a folder, you create a link which is open to anyone who has the link. You can change the content or stop sharing whenever you want.",
          shared:
            "Now you can share this link to students or other teachers. If you make changes in the folder, they become visible to everybody you have shared the link with.",
        },
        warning: {
          authenticated:
            "This folder is shared by {{ name }}, and contains course material, assignments and links to texts from both NDLA and other websites.",
          unauthenticated:
            "This folder is shared by {{ name }}, and contains course material, assignments and links to texts from both NDLA and other websites. Log onto My NDLA to copy the folder or save the link.",
        },
        button: {
          share: "Share folder",
          shareShort: "Share",
          preview: "Preview folder",
          previewShort: "Preview",
          goTo: "Go to shared folder",
          unShare: "Stop sharing",
          shareLink: "Copy link",
          saveLink: "Save the link",
          unSaveLink: "Remove the link",
        },
        save: {
          warning:
            "This creates a link to the folder in My folders. You can easily find the link by navigating to My Folders through the menu in My NDLA.",
          header: "Save the link to this folder",
          save: "Save the link to the shared folder",
        },
        previewInformation:
          "Preview of shared folder. The folder is not available to others until you update its status to shared.",
      },
    },
    iconMenu: {
      folders: "Folders",
      tags: "Tags",
      subjects: "Subjects",
      profile: "Profile",
      more: "More",
      learningpath: "Learning paths",
    },
    tagList: "Tags",
    tags_one: "{{count}} tag",
    tags_other: "{{count}} tags",
    moreTags_one: "Show one more tag",
    moreTags_other: "Show {{count}} more tags",
    confirmDeleteFolder:
      "Are you sure you want to delete this folder? Subfolders of this folder will also be deleted. This action cannot be undone.",

    confirmDeleteTag: "Are you sure you want to delete this tag? This process cannot be undone.",
    myFolders: "My folders",
    sharedByOthersFolders: "Folders shared by others",
    myTags: "My tags",
    mySubjects: "My subjects",
    newFolder: "New folder",
    newFolderShort: "New",
    newFolderUnder: "Create new folder under {{folderName}}",
    myAccount: "My account",
    favourites: "Favourites",
    addToFavourites: "Add to my favourites",
    alreadyFavourited: "Already in my favourites",
    alreadyInFolder: "Already in folder. You can still save new tags.",
    addInSharedFolder: "This folder is shared. Content you add will also be shared.",
    noFolderSelected: "Select or create a new folder to save the resource.",
    examLockInfo: "Editing content on Min NDLA is deactivated for pupils during the exam period.",
    copyFolderDisclaimer:
      "This creates a copy of the folder. Any changes made to the original folder will not be updated here.",
    loginCopyFolderPitch: "Do you wish to copy this folder?",
    loginSaveFolderLinkPitch: "Do you wish to save the link to this shared folder?",
    help: "Help",
    more: "More options",
    selectView: "Select view",
    listView: "List view",
    detailView: "Detailed listview",
    shortView: "Card view",
    userPictureAltText: "Profile picture",
    myPage: {
      noRecents: "You haven't added any resources yet. This is how you get started:",
      imageAlt:
        "Medium close-up of girl holding a tablet. On top of the tablet there are colour samples in different shapes and colours. Graphic image.",
      confirmDeleteAccount: "Are you sure you want to delete your account?",
      confirmDeleteAccountButton: "Delete account",
      myPage: "My page",
      logout: "Log out of My NDLA",
      loginIngress:
        "This page allows you to organize your articles in <b>your own</b> way! Use the heart button to highlight your favorite subjects or resources, and share them with students and colleagues across the country.",
      loginText:
        "In order to use the My NDLA service you have to be a student or work at a school in a county that partakes in the NDLA collaboration.",
      loginTextLink: "Read our privacy policy here",
      loginTerms: "Log in with Feide to receive access. By logging on your accept your terms of service",
      loginResourcePitch: "Do you want to favorite this resource?",
      loginWelcome: "Welcome to My NDLA!",
      deleteAccount: "Delete profile",
      loginPitch:
        "Welcome to My NDLA! Here you can save your favourite resources from NDLA, organize them and share them with others. Log in with your Feide account to get started.",
      loginPitchButton: "Log in to My NDLA",
      welcome:
        "Welcome to my NDLA! You can now save your favourite resources from NDLA and organise them in folders with tags",
      read: { read: "Read our", our: "." },
      privacy: "privacy statement",
      privacyLink: "https://ndla.no/article/personvernerklaering",
      questions: { question: "Any questions?", ask: "Ask NDLA" },
      wishToDelete: "Do you wish to delete your account?",
      terms: {
        terms: "Terms of use",
        term1: "Do not write personal or sensitive information in text fields.",
        term2: "Do not write offensive statements in text fields.",
        term3: "NDLA reserves the right to update or remove resources if they are not up to date.",
      },
      feide: "We have retrieved this information from Feide",
      feideWrongInfo:
        "If the information is incorrect, it has to be updated by the host organizationg or the school that the account is associated with. An overview of user support can be found here: feide.no/brukerstotte",
      recentFavourites: {
        title: "Recently added to my folders",
        link: "View all of your folders",
        search: "Search for resources",
        unauthorized: "Nothing here? Add a heart to some resources to show them here.",
      },
      favouriteSubjects: {
        noFavorites:
          "No favourite subjects? Use the heart button to add your favourite subjects, and you can easily find them again!",
        search: "See all subjects",
        viewAll: "See all favourite subjects",
      },
    },
    myProfile: {
      title: "My profile",
      disclaimerTitle: {
        employee: "Where is my name used?",
        student: "Where is my name used?",
      },
      disclaimerText: {
        employee:
          "Your name is displayed when you share a folder or a learning path. If you do not wish to share your name, you can stop sharing folders or learning paths.",
        student: "Your name is only displayed for you",
      },
      editButtonText: "Change profile picture",
      modalTexts: {
        title: "Upload a new profile picture",
        uploadSection: {
          title: "Drag and drop",
          subTitle: "or press to upload picture",
        },
        fileName: "Uploaded file:",
        fileTypes: "Accepted file types: PNG, JPG (Max 5MB)",
        savePicture: "Save profile picture",
        deletePicture: "Delete profile picture",
      },
    },
    favoriteSubjects: {
      title: "My subjects",
      subjects_one: "{{count}} subject",
      subjects_other: "{{count}} subjects",
      noFavorites: "Add a heart to subjects, and they will show up here.",
      goToAllSubjects: "Go to all subjects",
    },
    tools: "Tools",
    simpleList: "Simple list",
    detailedList: "With preamble",
  },
  ndlaFilm: {
    heading: "NDLA Film",
    slideBackwardsLabel: "Scroll backwards",
    slideForwardsLabel: "Scroll forwards",
    films: "Films",
    topics: "Topics",
    filterFilms: "Filter films",
    about: {
      more: "Read more about NDLA Film",
    },
    search: {
      categoryFromNdla: "Selected resources from NDLA",
    },
  },
  filmfrontpage: {
    resourcetype: {
      documentary: "Documentary",
      featureFilm: "Feature film",
      series: "Series",
      shortFilm: "Short film",
      all: "All movies A-Z",
    },
    allMovieGroupTitleLabel: "Movies starting with {{letter}}",
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
    embed: "Embed",
    unsupportedDialogTitle: "Failed to insert content",
    notSupported:
      "It did not work to auto-insert the content. You can copy the source code and add it to your content.",
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
    skipToContent: "Skip to content",
    activeSubjectSearch: "Search in subject",
    menuOptions: {
      programme: "Programmes",
      subjects: "Subjects",
      multidisciplinarySubjects: "Multidisciplinary subjects",
      toolboxStudents: "Toolbox - for students",
      toolboxTeachers: "Toolbox - for teachers",
      film: "NDLA Film",
    },
    menu: {
      button: "Menu",
      goToMainMenu: "Go to main menu",
      search: "Search",
      modalLabel: "Choose content",
      title: "What can we help you with?",
      open: "Open menu",
      close: "Close menu",
      myNdla: {
        yourFavouriteSubjects: "Your favourite subjects",
        viewAllFavouriteSubjects: "View all favourite subjects",
        loggedInAs: "Logged in as",
        myNdla: "My NDLA",
        arena: "The Arena",
        chatRobot: "The chat robot",
      },
      links: {
        education: {
          title: "Subjects and programmes",
          programmes: "Programmes",
          subjects: "All subjects",
          multidisciplinary: "Multidisciplinary subjects",
          film: "NDLA Film",
        },
        tips: {
          title: "Tips and advice",
          studentToolbox: "Toolbox for students",
          teacherToolbox: "Toolbox for teachers",
        },
        dynamic: {
          title: "About us",
        },
      },
    },
  },
  pagination: { next: "Next", prev: "Previous" },
  programmePage: {
    programmeSubjects: "Programme subjects",
  },
  aboutPage: {
    menuItems: "Subpages",
    nav: "Information pages",
  },
  subjectPage: {
    topicsTitle: "Topics in {{topic}}",
    multidisciplinaryLinksHeader: "Work multidisciplinarily with the subject",
  },
  toolboxPage: {
    introduction:
      "What will it mean to work exploratory? How can you learn better? What is needed in order to make group work function? In the toolbox both students and teach find resources that are current for every subject, and that support learning work and development of knowledge, skills and understanding.",
  },
  welcomePage: {
    resetSearch: "Empty search",
    programmes: "Programmes",
    heading: {
      heading: "The Norwegian Digital Learning Arena",
    },
    quickLinks: {
      title: "Our services",
      myNdla: {
        title: "My NDLA",
        description:
          "Organize the subject material in your way! Here you can easily favorite articles, your subjects or create learning paths for your students.",
      },
      chatRobot: {
        title: "NDLA chat robot",
        description:
          "Do you want to use AI in your education? NDLA has created two chat robots that takes care of your privacy, and can easily be used for work and education.",
      },
      arena: {
        title: "NDLA Arena",
        description:
          "Here you can share, discuss and cooperate with other teachers in upper secondary education. The Arena is open for all teachers in the counties NDLA cooperates with.",
      },
      film: {
        title: "NDLA Film",
        description:
          "NDLA Film is a service in cooperation with Norgesfilm. This service allows you to see a wide range of movies, short films, documentaries and series",
      },
    },
  },
  learningpathPage: {
    introduction: "Introduction",
    accordionTitle: "Learning path content",
    learningsteps: "Steps",
    stepCompleted: "Completed",
    externalWarning:
      "This learning path has been developed by an external teacher, who holds the editorial responsibility. Please note that it may contain texts and links that do not originate from ndla.no.",
    externalLink: "Open in a new window",
    bylineSuffix:
      "The learning path has been developed by a teacher. NDLA does not have editorial responsibility for this learning path. The learning path may contain texts and links that do not originate from ndla.no.",
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
    title: "Resources in {{language}}",
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
  richTextEditor: {
    plugin: {
      link: {
        edit: "Edit link",
        create: "Create link",
        popoverTitle: "Link to {{domain}}",
        form: {
          textLabel: "Text",
          urlLabel: "URL",
        },
      },
      span: {
        language: "Language",
      },
      heading: {
        label: "Choose text type",
        "normal-text": "Normal",
        "heading-2": "Heading 2",
        "heading-3": "Heading 3",
      },
    },
  },
  treeStructure: {
    maxFoldersAlreadyAdded: "Maximum subfolders reached",
    newFolder: {
      placeholder: "Add foldername",
      folderName: "Folder name",
      placedUnder: 'The folder will be placed under "{{folderName}}"',
    },
  },
  competenceGoals: {
    competenceGoalTitle: "The pupil is expected to be able to:",
    licenseData: "Containing data under",
    licenseFrom: "published at",
    competenceGoalResourceSearchText: "View resources for {{code}}",
    coreResourceSearchText: "View resources to core element {{code}}",
    competenceTabLK20label: "Competence goal",
    competenceTabCorelabel: "Core element",
    modalText: "Explore curriculum links",
    showCompetenceGoals: "Show competence goals",
    competenceGoalItem: {
      title: "Competence goals and assessment",
    },
  },
  subjectFrontPage: {
    buildsOn: "Builds on",
    connectedTo: "Common programme subject with",
    leadsTo: "Leads to",
  },
  learningPath: {
    lastUpdated: "Last updated",
    youAreInALearningPath: "You are now in a learningpath",
    nextArrow: "Go to next step",
    previousArrow: "Go to previous step",
    lastStep: {
      heading: "Last step of this learningpath",
      headingSmall: "You are now in the last step of the learningpath {{learningPathName}}",
      topicHeading: "Go to topic:",
      subjectHeading: "Go to subject:",
    },
  },
  createdBy: {
    content: "The resource",
    text: "is retrieved from",
  },
  tagSelector: {
    placeholder: "Enter tag name",
  },
  notFoundPage: {
    title: "Page not found",
    errorDescription: "We can't seem to find the page you are looking for.",
  },
  unpublishedResourcePage: {
    title: "Resource is unpublished",
    errorDescription: "The resource you are looking for has been unpublished.",
  },
  messageBoxInfo: {
    noContent: "We are sorry, but we do not yet offer any program courses.",
    resources: "This is not a complete course, but a collection of resources we hope you will find useful.",
    subjectOutdated: "This course is not updated to the current curriculum.",
    subjectBeta: "This course is under development. New resources are being added continously.",
    frontPageExpired:
      "Expired subjects are not being taught any longer, but it may still be possible to take exams in these subjects.",
  },
  programmes: {
    header: "What do you want to learn today?",
    description: "Choose a programme to see your subjects",
    grades: "Grades",
  },
  common: {
    subject_one: "Subject",
    subject_other: "Subjects",
  },
  resource: {
    noCoreResourcesAvailableUnspecific: "There is no core content available.",
    noCoreResourcesAvailable: "There is no core content available for {{name}}.",
    activateAdditionalResources: "Show additional content",
    label: "Learning content",
    tooltipCoreTopic: "Core content",
    tooltipAdditionalTopic: "Additional content",
    additionalTooltip: "Additional content is not on the curriculum",
    trait: {
      audio: "Audio",
      h5p: "Interactive",
      podcast: "Podcast",
      video: "Video",
    },
  },
  navigation: {
    additionalTopic: "Additional topic",
  },
  siteNav: {
    close: "Close search",
  },
  labels: {
    other: "Other",
  },
  multidisciplinarySubject: {
    subjectsLinksDescription: "Case in",
  },
  frontpageMenu: {
    allsubjects: "All subjects",
  },
  frontpageMultidisciplinarySubject: {
    text: "The three interdisciplinary topics in the curriculum are based on current societal challenges that require the involvement and efforts of individuals and the community in the local community, nationally and globally.",
  },
  footer: {
    info: "This webapplication is developed as Open Source code.",
    editorInChief: "Editor in chief:",
    linksHeader: "Contact",
    availabilityLink: "Availability statement",
    privacyLink: "Privacy statement",
    cookiesLink: "Statement about cookies",
    aboutWebsite: "About",
    vision: "We create the learning of the future together",
    followUs: "Follow us",
    socialMediaLinks: {
      facebook: "NDLA on Facebook",
      newsletter: "Sign up for our Newsletter",
      youtube: "NDLA on YouTube",
      linkedin: "NDLA on LinkedIn",
      instagram: "NDLA on Instagram",
    },
    ndlaLinks: {
      omNdla: "Om NDLA",
      aboutNdla: "About NDLA",
      contact: "Contact us",
    },
    otherLanguages: "Other languages",
  },
  user: {
    loggedInAs: "You are logged in as {{role}}.",
    role: {
      employee: "Employee",
      student: "Student",
    },
    buttonLogIn: "Log in with Feide",
    buttonLogOut: "Log out",
    resource: {
      accessDenied: "We are sorry, but you do not have access to this page.",
    },
    primarySchool: "Primary School",
    name: "Name",
    mail: "E-mail",
    username: "Username",
    wrongUserInfoDisclaimer:
      "If any information is wrong, it must be updated by the host organization/school owner the user belongs to. An overview of available user support can be found here: ",
  },
};

export default messages;
