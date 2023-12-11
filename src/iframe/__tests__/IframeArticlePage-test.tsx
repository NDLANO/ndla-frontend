/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider, Translation } from 'react-i18next';
import { StaticRouter } from 'react-router-dom/server.js';
import { MockedProvider } from '@apollo/client/testing';
import { createSerializer } from '@emotion/jest';
import { render } from '@testing-library/react';
import { i18nInstance } from '@ndla/ui';
import { initializeI18n } from '../../i18n';
import IframeArticlePage from '../IframeArticlePage';
import IframePageContainer from '../IframePageContainer';

window._mtm = [];
HelmetProvider.canUseDOM = false;

expect.addSnapshotSerializer(createSerializer());

// Mock IntersectionObserver
class IntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

test('IframeArticlePage with article renderers correctly', () => {
  const locale = 'nb';
  const article = {
    id: 54,
    language: 'nb',
    revision: 1,
    articleType: 'standard',
    content:
      '<section><p>Dersom du leser de ulike partiprogrammene, ser du fort at partiene har ulike svar både på hva som er viktige utfordringer, og på hvordan de skal løses.</p></section>',
    created: '2018-01-09T18:40:03Z',
    introduction:
      '<p>Politiske skillelinjer, eller konfliktlinjer, er varige og grunnleggende motsetninger i samfunnet og blant velgerne. Du synes kanskje det er vanskelig å se forskjell på de politiske partiene – det er du i så fall ikke alene om!</p>',
    metaDescription: 'Politiske skillelinjer, eller konfliktlinjer',
    metaData: {
      footnotes: [],
    },
    concepts: [
      {
        content:
          'B-cellene reagerer på den tredimensjonale strukturen til et antigen (smittestoff eller et fremmed protein), mens T-cellene reagerer på primærstrukturen (aminosyrerekkefølgen) til proteiner.',
        id: 468,
        title: 'B- og T-celler aktiveres på ulik måte',
        created: '2019-06-17T13:53:27Z',
        tags: [],
        image: {
          title:
            'Oppgavebilde – T-hjelpercelle stilulerer og T-drepercelle dreper',
          src: 'https://api.test.ndla.no/image-api/raw/t-hjelper-t-dreper-drep-cella-fagocytt.jpg',
          altText: 'Oppgavebilde av T-celler',
          copyright: {
            license: {
              url: 'https://creativecommons.org/licenses/by-sa/4.0/',
              license: 'CC-BY-SA-4.0',
              description:
                'Creative Commons Attribution-ShareAlike 4.0 International',
            },
            creators: [
              {
                type: 'Originator',
                name: 'Kristin Bøhle',
              },
            ],
            processors: [],
            rightsholders: [],
            origin: '',
          },
          contentType: 'image/jpeg',
        },
        subjectIds: [
          'urn:subject:3d9454e8-460e-42c7-8f28-71663fbbf6e6',
          'urn:subject:f665de3e-65dc-478e-b736-cb0af3d38ad4',
        ],
        subjectNames: ['Naturfag +', 'Biologi - 2021 +'],
        articleIds: [],
        visualElement: {
          resource: 'brightcove',
          url: 'https://players.brightcove.net/4806596774001/BkLm8fT_default/index.html?videoId=5796541737001',
          copyright: {
            rightsholders: [
              {
                name: 'Colibri Design',
                type: 'supplier',
              },
            ],
            processors: [],
            creators: [
              {
                name: 'Per-Odd Eggen',
                type: 'writer',
              },
              {
                name: 'Kristin Bøhle',
                type: 'writer',
              },
            ],
            license: {
              license: 'CC-BY-SA-4.0',
              description: 'asd',
            },
          },
          language: 'nb',
          title: 'Aktivering av B-lymfocytt',
          brightcove: {
            videoid: '5796541737001',
            player: 'BkLm8fT',
            account: '4806596774001',
            caption: '',
            description: 'asd',
            cover:
              'https://cf-images.eu-west-1.prod.boltdns.net/v1/static/4806596774001/9b375240-8f81-48a4-a9c1-46df717a6fb9/0be10458-ee7a-4545-a9da-dbbc1398431b/1280x720/match/image.jpg',
            src: 'https://players.brightcove.net/4806596774001/BkLm8fT_default/index.html?videoId=5796541737001',
            download:
              'http://house-fastly-signed-eu-west-1-prod.brightcovecdn.com/media/v1/pmp4/static/clear/4806596774001/9b375240-8f81-48a4-a9c1-46df717a6fb9/1ac27a06-62b5-4742-9084-42590e9a7842/main.mp4?fastly_token=NjE2NzQ4NGNfOTM3ZjAyODNkYjc3NDFiNDc1OTdiMGNjMTNlZjkwNjJkZmMwZjNmNTU0MjU2OWQ3M2FlZGE0NzJiMmFlZTNmZV8vL2hvdXNlLWZhc3RseS1zaWduZWQtZXUtd2VzdC0xLXByb2QuYnJpZ2h0Y292ZWNkbi5jb20vbWVkaWEvdjEvcG1wNC9zdGF0aWMvY2xlYXIvNDgwNjU5Njc3NDAwMS85YjM3NTI0MC04ZjgxLTQ4YTQtYTljMS00NmRmNzE3YTZmYjkvMWFjMjdhMDYtNjJiNS00NzQyLTkwODQtNDI1OTBlOWE3ODQyL21haW4ubXA0',
            iframe: {
              width: 1280,
              height: 720,
              src: 'https://players.brightcove.net/4806596774001/BkLm8fT_default/index.html?videoId=5796541737001',
            },
            uploadDate: '2018-06-12T10:22:06.898Z',
            copyText:
              'Writer: Per-Odd Eggen, Writer: Kristin Bøhle. Aktivering av B-lymfocytt [Internet]. Supplier: Colibri Design. Downloaded from: https://players.brightcove.net/4806596774001/BkLm8fT_default/index.html?videoId=5796541737001 Read: 13.10.2021',
          },
        },
        copyright: {
          license: {
            license: 'CC-BY-SA-4.0',
            url: 'https://creativecommons.org/licenses/by-sa/4.0/',
            description:
              'Creative Commons Attribution-ShareAlike 4.0 International',
          },
          creators: [
            {
              type: 'Writer',
              name: 'Kristin Bøhle',
            },
          ],
          processors: [],
          rightsholders: [],
        },
      },
    ],
    competenceGoals: [],
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
  const i18n = initializeI18n(i18nInstance, 'nb');
  const { asFragment } = render(
    <I18nextProvider i18n={i18n}>
      <MockedProvider mocks={[]}>
        <HelmetProvider>
          <StaticRouter
            location={{
              pathname: '/article-iframe/urn:resource:1/128',
              search: 'asd',
              hash: '',
            }}
          >
            <I18nextProvider i18n={i18nInstance}>
              <Translation>
                {(_, { i18n }) => {
                  i18n.language = locale;
                  return (
                    <IframeArticlePage
                      locale={locale}
                      resource={{
                        id: 'urn:resource:1',
                        path: '/subject:1/resource:1',
                        resourceTypes: [],
                      }}
                      article={article}
                    />
                  );
                }}
              </Translation>
            </I18nextProvider>
          </StaticRouter>
        </HelmetProvider>
      </MockedProvider>
    </I18nextProvider>,
  );

  expect(asFragment()).toMatchSnapshot();
});

test('IframePage with article displays error message on status === error', () => {
  const i18n = initializeI18n(i18nInstance, 'nb');
  const { asFragment } = render(
    <I18nextProvider i18n={i18n}>
      <MockedProvider mocks={[]}>
        <HelmetProvider>
          <StaticRouter
            location={{
              pathname: '/article-iframe/urn:resource:1/128',
              search: 'asd',
              hash: '',
            }}
          >
            <IframePageContainer locale={'nb'} status="error" />
          </StaticRouter>
        </HelmetProvider>
      </MockedProvider>
    </I18nextProvider>,
  );

  expect(asFragment()).toMatchSnapshot();
});
