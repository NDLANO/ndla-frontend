/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export default {
  totalCount: 32,
  page: 3,
  pageSize: 2,
  results: [
    {
      id: '121',
      contexts: [],
      ingress: '',
      title: 'Mediene dekker mange behov',
      url: undefined,
      urls: [],
    },
    {
      id: '116',
      contexts: [],
      ingress: '',
      title: 'Medieerfaringer og medieopplevelser',
      url: undefined,
      urls: [],
    },
  ],
};

export const searchNotTranslated = {
  totalCount: 32,
  page: 3,
  pageSize: 2,
  results: [
    {
      id: '121',
      contexts: [],
      title: { title: 'Mediene dekker mange behov', language: 'nb' },
      url: undefined,
      urls: [],
    },
    {
      id: '116',
      contexts: [],
      title: { title: 'Medieerfaringer og medieopplevelser', language: 'nb' },
      url: undefined,
      urls: [],
    },
  ],
};

export const searchSubjectResultsWithSubjectMaterial = {
  totalCount: 273,
  page: 1,
  pageSize: 10,
  results: [
    {
      id: '121',
      contexts: [],
      contentType: 'subject-material',
      contentTypes: ['subject-material', 'subject'],
      title: 'Analyse av medieuttrykk',
      metaImage: {
        url: 'https://ndla.no/image-api/raw/id/18',
        alt: 'bilde alt',
      },
      url:
        '/subjects/subject:14/topic:1:103867/topic:1:185606/resource:1:106142',
      urls: [
        {
          url:
            '/subjects/subject:14/topic:1:103867/topic:1:185606/resource:1:106142',
          contentType: 'subject-material',
        },
        {
          url: '/subjects/subject:1/topic:1:186479/topic:1:106142',
          contentType: 'subject',
        },
      ],
    },
    {
      id: '121',
      contexts: [],
      contentType: 'learning-path',
      contentTypes: ['learning-path'],
      title: 'Fortelleteknikk i digitale medier',
      metaImage: {
        url: 'https://ndla.no/image-api/raw/id/17',
        alt: 'bilde alt',
      },
      url: {
        href: 'https://ndla.no/learningpaths/10/first-step',
        rel: 'noopener noreferrer',
        target: '_blank',
      },
      urls: [
        {
          url: {
            href: 'https://ndla.no/learningpaths/10/first-step',
            rel: 'noopener noreferrer',
            target: '_blank',
          },
          contentType: 'learning-path',
        },
      ],
    },
  ],
};
