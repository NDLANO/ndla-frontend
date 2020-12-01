/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import getStructuredDataFromArticle from '../getStructuredDataFromArticle';

const getBaseCopyrightInfo = () => ({
  creators: [],
  rightsholders: [],
  processors: [],
  license: {
    url: 'http://license.url',
  },
});

const getBaseArticle = () => ({
  copyright: {
    ...getBaseCopyrightInfo(),
    creators: [
      {
        name: 'Creator name',
      },
    ],
    rightsholders: [
      {
        name: 'Copy holder name',
      },
    ],
    processors: [
      {
        name: 'Processor name',
      },
    ],
  },
  title: 'Article title',
  metaData: {},
});

test('util/getStructuredDataFromArticle article with copyright should return structured data', () => {
  const article = getBaseArticle();

  const structuredData = getStructuredDataFromArticle(article);
  expect(structuredData.length).toBe(1);
  expect(structuredData[0].author[0].name).toBe(
    article.copyright.creators[0].name,
  );
  expect(structuredData[0].author[0]['@type']).toBe('Person');
  expect(structuredData[0].contributor[0].name).toBe(
    article.copyright.processors[0].name,
  );
  expect(structuredData[0].contributor[0]['@type']).toBe('Person');
  expect(structuredData[0].copyrightHolder[0].name).toBe(
    article.copyright.rightsholders[0].name,
  );
  expect(structuredData[0].copyrightHolder[0]['@type']).toBe('Organization');
  expect(structuredData[0]['@type']).toBe('Article');
  expect(structuredData[0].name).toBe(article.title);
});

test('util/getStructuredDataFromArticle article with image should return image structured data', () => {
  const article = getBaseArticle();
  article.metaData.images = [
    {
      title: 'Image title',
      src: 'http://image.url',
      copyright: getBaseCopyrightInfo(),
    },
  ];

  const structuredData = getStructuredDataFromArticle(article);

  expect(structuredData.length).toBe(2);
  expect(structuredData[1].name).toBe(article.metaData.images[0].title);
  expect(structuredData[1].contentUrl).toBe(article.metaData.images[0].src);
  expect(structuredData[1]['@type']).toBe('ImageObject');
});

test('util/getStructuredDataFromArticle article with video should return video structured data', () => {
  const article = getBaseArticle();
  article.metaData.brightcoves = [
    {
      title: 'Video title',
      src: 'http://video.url',
      copyright: getBaseCopyrightInfo(),
    },
  ];

  const structuredData = getStructuredDataFromArticle(article);

  expect(structuredData.length).toBe(2);
  expect(structuredData[1].name).toBe(article.metaData.brightcoves[0].title);
  expect(structuredData[1].embedUrl).toBe(article.metaData.brightcoves[0].src);
  expect(structuredData[1]['@type']).toBe('VideoObject');
});

test('util/getStructuredDataFromArticle article with breadcrumbs should return breadcrumbitems', () => {
  const article = getBaseArticle();
  const breadcrumbItems = [
    {
      to: '/',
      name: 'NDLA',
    }, {
      to: '/subjects/subject:1/',
      name: 'MEDIEUTTRYKK OG MEDIESAMFUNNET',
    }
  ];
  const structuredData = getStructuredDataFromArticle(article, breadcrumbItems);
  expect(structuredData.length).toBe(2);
  expect(structuredData[1]['@type']).toBe('BreadcrumbList');
  expect(structuredData[1].numberOfItems).toBe(2);
});
