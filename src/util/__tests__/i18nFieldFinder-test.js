/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import test from 'tape';

import { oembedContentI18N, titleI18N } from '../i18nFieldFinder';

test('util/i18nFieldFinder titleI18N', t => {
  const someObject = {
    title: [
      { title: 'Bokmål', language: 'nb' },
      { title: 'Nynorsk', language: 'nn' },
      { title: 'English', language: 'en' },
    ],
  };

  t.deepEqual(titleI18N(someObject, 'nb'), 'Bokmål');
  t.deepEqual(titleI18N(someObject, 'nn'), 'Nynorsk');
  t.deepEqual(titleI18N(someObject, 'en'), 'English');
  t.deepEqual(titleI18N(someObject, 'es'), undefined);

  t.end();
});

test('util/i18nFieldFinder titleI18N with fallback', t => {
  const someObject1 = {
    title: [
      { title: 'Bokmål', language: 'nb' },
      { title: 'English', language: 'en' },
    ],
  };

  t.deepEqual(titleI18N(someObject1, 'nb', true), 'Bokmål');
  t.deepEqual(titleI18N(someObject1, 'en', true), 'English');
  t.deepEqual(titleI18N(someObject1, 'nn', true), 'Bokmål');

  const someObject2 = {
    title: [
      { title: 'English', language: 'en' },
    ],
  };

  t.deepEqual(titleI18N(someObject2, 'nb', true), 'English');
  t.deepEqual(titleI18N(someObject2, 'en', true), 'English');
  t.deepEqual(titleI18N(someObject2, 'es', true), 'English');

  t.end();
});

test('util/i18nFieldFinder oembedContentI18N', t => {
  t.equal(typeof oembedContentI18N, 'function');

  const someObject = {
    embedUrl: [
      { url: 'http://example.com/sv', html: '<iframe src="http://example.com/sv">', width: 500, language: 'sv' },
      { url: 'http://example.com', html: '<iframe src="http://example.com">', width: 500, language: 'nb' },
    ],
  };

  t.deepEqual(oembedContentI18N(someObject, 'nb'),
      { url: 'http://example.com', html: '<iframe src="http://example.com">', width: 500, language: 'nb' });

  t.notOk(oembedContentI18N(someObject, 'eo'));

  t.end();
});
