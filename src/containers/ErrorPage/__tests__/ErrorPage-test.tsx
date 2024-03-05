/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HelmetProvider } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import { StaticRouter } from "react-router-dom/server.js";
import { render } from "@testing-library/react";
import { i18nInstance } from "@ndla/ui";
import { initializeI18n } from "../../../i18n";
import ErrorPage from "../ErrorPage";

HelmetProvider.canUseDOM = false;

vi.mock("../../../config.ts", () => {
  return {
    default: {
      zendeskWidgetKey: "123",
      runtimeType: "test",
    },
  };
});

test("ErrorPage renderers correctly", () => {
  const i18n = initializeI18n(i18nInstance, "nb");
  const { asFragment } = render(
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <StaticRouter location="">
          <ErrorPage />
        </StaticRouter>
      </I18nextProvider>
    </HelmetProvider>,
  );

  expect(asFragment()).toMatchSnapshot();
});
