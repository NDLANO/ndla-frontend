/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment jsdom
 */

import React from 'react';
import nock from 'nock';
import renderer from 'react-test-renderer';
import serializer from 'jest-emotion';
import IntlProvider from '@ndla/i18n';
import IframePageContainer from '../IframePageContainer';
import { getLocaleObject } from '../../i18n';
import IframeArticlePage, { fetchResourceId } from '../IframeArticlePage';

expect.addSnapshotSerializer(serializer);

test('IframeArticlePage with article renderers correctly', () => {
  nock('http://ndla-api')
    .get('/taxonomy/v1/resources/urn:resource:1/?language=nb')
    .reply(200, {
      id: 'urn:resource:1',
      title: 'Ressurs',
    });

  const locale = getLocaleObject('nb');
  const article = {
    content:
      '<section><p>Dersom du leser de ulike partiprogrammene, ser du fort at partiene har ulike svar både på hva som er viktige utfordringer, og på hvordan de skal løses.</p></section>',
    created: '2018-01-09T18:40:03Z',
    introduction:
      'Politiske skillelinjer, eller konfliktlinjer, er varige og grunnleggende motsetninger i samfunnet og blant velgerne. Du synes kanskje det er vanskelig å se forskjell på de politiske partiene – det er du i så fall ikke alene om!',
    metaDescription: 'Politiske skillelinjer, eller konfliktlinjer',
    metaData: {
      footnotes: '',
    },
    copyright: {
      license: {
        license: 'by-sa',
        description: 'Creative Commons Attribution-ShareAlike 2.0 Generic',
        url: 'https://creativecommons.org/licenses/by-sa/2.0/',
      },
      creators: [
        {
          type: 'Writer',
          name: 'Someone',
        },
      ],
      processors: [],
      rightsholders: [],
    },
    oldNdlaUrl: '//red.ndla.no/node/168554',
    requiredLibraries: [],
    title: 'Politiske skillelinjer',
    updated: '2018-01-09T18:43:48Z',
    published: '2018-01-09T18:43:48Z',
    supportedLanguages: ['nb'],
  };
  const component = renderer.create(
    <IntlProvider locale={locale.abbreviation} messages={locale.messages}>
      <IframeArticlePage
        locale={locale.abbreviation}
        location={{ pathname: '/article-iframe/urn:resource:1/128' }}
        resource={{
          id: 'urn:resource:1',
          name: 'Ressurs',
          path: '/subject:1/resource:1',
          article,
          resourceTypes: [],
        }}
        article={article}
      />
    </IntlProvider>,
  );

  expect(component.toJSON()).toMatchSnapshot();
});

test('IframePage with article displays error message on status === error', () => {
  const component = renderer.create(
    <IframePageContainer
      location={{ pathname: '/article-iframe/333' }}
      locale={getLocaleObject('nb')}
      status="error"
    />,
  );

  expect(component.toJSON()).toMatchSnapshot();
});

test('fetchResourceId fetches correct resource id from path', () => {
  const url =
    'https://ndla.no/article-iframe/urn:resource:670ac97d-1d4d-4515-9554-07e0870e66aa/24835?removeRelatedContent=true';
  expect(fetchResourceId({ location: { pathname: url } })).toMatch(
    'urn:resource:670ac97d-1d4d-4515-9554-07e0870e66aa',
  );

  const urlWithLang =
    'https://ndla.no/article-iframe/nb/urn:resource:670ac97d-1d4d-4515-9554-07e0870e66aa/24835?removeRelatedContent=true';
  expect(fetchResourceId({ location: { pathname: urlWithLang } })).toMatch(
    'urn:resource:670ac97d-1d4d-4515-9554-07e0870e66aa',
  );
});
