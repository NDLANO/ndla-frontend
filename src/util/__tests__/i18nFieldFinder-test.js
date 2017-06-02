/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { oembedContentI18N, titleI18N } from '../i18nFieldFinder';

test('util/i18nFieldFinder titleI18N', () => {
  const someObject = {
    title: [
      { title: 'Bokmål', language: 'nb' },
      { title: 'Nynorsk', language: 'nn' },
      { title: 'English', language: 'en' },
    ],
  };

  expect(titleI18N(someObject, 'nb')).toEqual('Bokmål');
  expect(titleI18N(someObject, 'nn')).toEqual('Nynorsk');
  expect(titleI18N(someObject, 'en')).toEqual('English');
  expect(titleI18N(someObject, 'es')).toEqual(undefined);
});

test('util/i18nFieldFinder titleI18N with fallback', () => {
  const someObject1 = {
    title: [
      { title: 'Bokmål', language: 'nb' },
      { title: 'English', language: 'en' },
    ],
  };

  expect(titleI18N(someObject1, 'nb', true)).toEqual('Bokmål');
  expect(titleI18N(someObject1, 'en', true)).toEqual('English');
  expect(titleI18N(someObject1, 'nn', true)).toEqual('Bokmål');

  const someObject2 = {
    title: [{ title: 'English', language: 'en' }],
  };

  expect(titleI18N(someObject2, 'nb', true)).toEqual('English');
  expect(titleI18N(someObject2, 'en', true)).toEqual('English');
  expect(titleI18N(someObject2, 'es', true)).toEqual('English');
});

test('util/i18nFieldFinder oembedContentI18N', () => {
  expect(typeof oembedContentI18N).toBe('function');

  const someObject = {
    embedUrl: [
      {
        url: 'http://example.com/sv',
        html: '<iframe src="http://example.com/sv">',
        width: 500,
        language: 'sv',
      },
      {
        url: 'http://example.com',
        html: '<iframe src="http://example.com">',
        width: 500,
        language: 'nb',
      },
    ],
  };

  expect(oembedContentI18N(someObject, 'nb')).toEqual({
    url: 'http://example.com',
    html: '<iframe src="http://example.com">',
    width: 500,
    language: 'nb',
  });

  expect(oembedContentI18N(someObject, 'eo')).toBeFalsy();
});
