/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MockedProvider } from "@apollo/client/testing/react";
import { render } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { StaticRouter } from "react-router";
import { initializeI18nTest } from "../../__tests__/i18nTestHelpers";
import { alertsQuery } from "../../components/AlertsContext";
import { GQLIframeArticlePage_ArticleFragment } from "../../graphqlTypes";
import { IframeArticlePage } from "../IframeArticlePage";

window._mtm = [];

// Mock IntersectionObserver
class IntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

Object.defineProperty(global, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

test("IframeArticlePage with article renderers correctly", () => {
  const locale = "nb";
  const article: GQLIframeArticlePage_ArticleFragment = {
    __typename: "Article",
    id: 54,
    oembed: null,
    tags: null,
    grepCodes: null,
    revisionDate: null,
    metaImage: null,
    coreElements: [],
    language: "nb",
    revision: 1,
    articleType: "standard",
    created: "2018-01-09T18:40:03Z",
    traits: [],
    transformedDisclaimer: {
      __typename: "TransformedArticleContent",
      content: "",
    },
    htmlIntroduction:
      "<p>Politiske skillelinjer, eller konfliktlinjer, er varige og grunnleggende motsetninger i samfunnet og blant velgerne. Du synes kanskje det er vanskelig å se forskjell på de politiske partiene – det er du i så fall ikke alene om!</p>",
    metaDescription: "Politiske skillelinjer, eller konfliktlinjer",
    transformedContent: {
      __typename: "TransformedArticleContent",
      content:
        "<section><p>Dersom du leser de ulike partiprogrammene, ser du fort at partiene har ulike svar både på hva som er viktige utfordringer, og på hvordan de skal løses.</p></section>",
      metaData: {
        __typename: "ArticleMetaData",
        copyText: null,
        footnotes: [],
        images: [],
        brightcoves: [],
        audios: [],
        podcasts: [],
        concepts: [],
        glosses: [],
        h5ps: [],
        textblocks: [],
      },
    },
    competenceGoals: [],
    copyright: {
      __typename: "Copyright",
      processed: null,
      origin: null,
      license: {
        __typename: "License",
        license: "by-sa",
        url: "https://creativecommons.org/licenses/by-sa/2.0/",
      },
      creators: [
        {
          __typename: "Contributor",
          type: "Writer",
          name: "Someone",
        },
      ],
      processors: [],
      rightsholders: [],
    },
    requiredLibraries: [],
    title: "Politiske skillelinjer",
    htmlTitle: "Politiske skillelinjer",
    updated: "2018-01-09T18:43:48Z",
    published: "2018-01-09T18:43:48Z",
    revised: "2018-01-09T18:43:48Z",
    supportedLanguages: ["nb"],
  };
  const i18n = initializeI18nTest(locale);
  const alertMock = [
    {
      request: {
        query: alertsQuery,
        variables: {},
      },
      result: {
        data: {
          alerts: [],
        },
      },
    },
  ];
  const { asFragment } = render(
    <I18nextProvider i18n={i18n}>
      <MockedProvider mocks={alertMock}>
        <StaticRouter
          location={{
            pathname: "/article-iframe/urn:resource:1/128",
            search: "asd",
            hash: "",
          }}
        >
          <IframeArticlePage
            locale={locale}
            node={{
              __typename: "Node",
              id: "urn:resource:1",
              nodeType: "RESOURCE",
              name: "Politiske skillelinjer",
              url: "/r/naturfag/politiske-skillelinjer/asdfw323",
              resourceTypes: [],
              defaultUrl: null,
              relevanceId: null,
            }}
            article={article}
          />
        </StaticRouter>
      </MockedProvider>
    </I18nextProvider>,
  );

  expect(asFragment()).toMatchSnapshot();
});
