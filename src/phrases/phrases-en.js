/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const phrases = {
  articlePage: {
    errorDescription: 'Sorry, an error occurd while loading the resource.',
    error404Description:
      "Sorry, we can't locate the resource you are looking for.",
  },
  notFoundPage: {
    errorDescription: "We can't seem to find the page you are looking for.",
  },
  searchPage: {
    noHits: 'Your search - {query} - did not match any articles. ',
  },
  subjectPage: {
    errorDescription: 'Sorry, an error occurd while loading the topics.',
    tabs: {
      topics: 'Topics',
    },
  },
  subjectsPage: {
    chooseSubject: 'Choose subject',
    errorDescription: 'Sorry, an error occurd while loading the subjects.',
  },
  topicPage: {
    topicErrorDescription:
      'Sorry, an error occurd while loading topic content.',
    articleErrorDescription:
      'Sorry, an error occurd while loading the topic description.',
    topic: 'TOPIC',
    topics: 'Topics',
  },
  welcomePage: {
    subjects: 'Subjects',
    search: 'Search',
    errorDescription: 'Sorry, an error occurd while loading the subjects.',
  },
  meta: {
    description: 'Norwegian Digital Learning Arena, Open Educational Resources',
  },
  masthead: {
    menu: {
      close: 'Close',
      goTo: 'Go to',
      search: 'Search',
      subjectOverview: 'Subject overview',
      title: 'Menu',
    },
  },
  logo: {
    altText: 'The Norwegian Digital Learning Arena',
  },
  resource: {
    errorDescription:
      'Sorry, an error occurd while loading the topic resources.',
    noCoreResourcesAvailable: 'There is no core content available.',
    activateAdditionalResources: 'Show additional content',
    toggleFilterLabel: 'Additional content',
    showLess: 'Show less',
    showMore: 'Show more',
  },
  searchForm: {
    placeholder: 'Search articles',
    btn: 'Search',
    order: {
      relevance: 'Relevance',
      title: 'Alphabetical',
    },
  },
  article: {
    author: 'Author',
    published: 'Published',
    created: 'Created',
    lastUpdated: 'Last updated',
    closeLicenseBox: 'Close box',
    openLicenseBox: 'Cite or use',
  },
  subject: {
    associatedTopics: 'Associated topics',
  },
  license: {
    heading: 'Howto reuse content',
    tabs: {
      text: 'Text',
      images: 'Images',
      audio: 'Audio',
      video: 'Video',
    },
    images: {
      heading: 'How to use images from the article',
      description:
        'Remember to copy the text to be attached to the image where you use it.',
      rules: 'Rules for use of image:',
      source: 'Source',
      title: 'Title',
    },
    text: {
      heading: 'How to use text from the article',
      description:
        'The article may be composed of several different texts, which are listed here.',
      rules: 'Rules for use of text:',
      published: 'Published',
    },
    audio: {
      heading: 'How to use audio files from the article',
      description:
        'Remember to copy the text to be attached to the audio where you use it.',
      rules: 'Rules for use of audio file:',
    },
    video: {
      heading: 'How to use videos from the article',
      description:
        'Remember to copy the text to be attached to the video where you use it.',
      rules: 'Rules for use of audio file:',
    },
    learnMore: 'Learn more about open licenses',
    copyTitle: 'Copy reference',
    embed: 'Embed',
    embedCopied: 'Copied embed code!',
    hasCopiedTitle: 'Copied!',
    download: 'Download',
    creditType: {
      originator: 'Originator',
      photographer: 'Photographer',
      artist: 'Artist',
      editorial: 'Editorial',
      writer: 'Writer',
      scriptwriter: 'Scriptwriter',
      reader: 'Reader',
      translator: 'Translator',
      director: 'Director',
      illustrator: 'Illustrator',
      cowriter: 'Cowriter',
      composer: 'Composer',
      processor: 'Processor',
      facilitator: 'facilitator',
      linguistic: 'Linguistic',
      idea: 'Idea',
      compiler: 'Compiler',
      correction: 'Correction',
      rightsholder: 'Rightsholder',
      publisher: 'Publisher',
      distributor: 'Distributor',
      supplier: 'Supplier',
    },
  },
  breadcrumb: {
    subjectsLinkText: 'Subject',
    label: 'You are here:',
  },
  errorMessage: {
    title: 'Oops, something went wrong',
    description: 'Sorry, an error occurd.',
    back: 'Back',
    goToFrontPage: 'Go to frontpage',
  },
  footer: {
    aboutNDLA: 'About NDLA',
    selectLanguage: 'Choose language (språk): ',
    footerInfo: 'This webapplication is developed by NDLA as Open Source code.',
    footerEditiorInChief: 'Editor in chief: ',
    footerManagingEditor: 'Managing editor: ',
  },
};

export default phrases;
