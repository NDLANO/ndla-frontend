/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  ErrorMessageDescription,
  ErrorMessageRoot,
  ErrorMessageTitle,
  ErrorMessageContent,
  ErrorMessageActions,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { useTranslation } from "react-i18next";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/PageTitle";
import { Status } from "../../components/Status";
import { SKIP_TO_CONTENT_ID } from "../../constants";

interface NotFoundProps {
  applySkipToContentId?: boolean;
}

const NotFound = ({ applySkipToContentId }: NotFoundProps) => {
  const { t } = useTranslation();
  return (
    <Status code={404}>
      <ErrorMessageRoot>
        <PageTitle title={t("htmlTitles.notFound")} />
        <img src={"/static/not-exist.gif"} alt={t("errorMessage.title")} />
        <ErrorMessageContent>
          <ErrorMessageTitle id={applySkipToContentId ? SKIP_TO_CONTENT_ID : undefined}>
            {t("notFoundPage.title")}
          </ErrorMessageTitle>
          <ErrorMessageDescription>{t("notFoundPage.errorDescription")}</ErrorMessageDescription>
        </ErrorMessageContent>
        <ErrorMessageActions>
          <SafeLink to="/">{t("errorMessage.goToFrontPage")}</SafeLink>
        </ErrorMessageActions>
      </ErrorMessageRoot>
    </Status>
  );
};

export const NotFoundPage = () => {
  return (
    <PageContainer asChild consumeCss>
      <main>
        <NotFound applySkipToContentId={true} />
      </main>
    </PageContainer>
  );
};

export const Component = NotFoundPage;
