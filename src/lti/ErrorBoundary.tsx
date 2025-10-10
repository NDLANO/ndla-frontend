/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { DefaultErrorMessage } from "../components/DefaultErrorMessage";
import Status from "../components/Status";
import { ErrorElement } from "../RouteErrorElement";
import { INTERNAL_SERVER_ERROR } from "../statusCodes";

export const ErrorBoundary = () => {
  const { t } = useTranslation();
  return (
    <ErrorElement>
      <Status code={INTERNAL_SERVER_ERROR}>
        <title>{t("htmlTitles.errorPage")}</title>
        <meta name="description" content={t("meta.description")} />
        <main>
          <DefaultErrorMessage applySkipToContentId />
        </main>
      </Status>
    </ErrorElement>
  );
};
