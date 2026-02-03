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
  ErrorMessageContent,
  ErrorMessageTitle,
  ErrorMessageActions,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { useTranslation } from "react-i18next";
import { Status } from "../components/Status";
import { SKIP_TO_CONTENT_ID } from "../constants";
import { PageContainer } from "./Layout/PageContainer";
import { PageTitle } from "./PageTitle";

interface MessageRootProps {
  applySkipToContentId?: boolean;
}

export const DefaultErrorMessage = ({ applySkipToContentId }: MessageRootProps) => {
  const { t } = useTranslation();

  return (
    <Status code={500}>
      <ErrorMessageRoot>
        <img src={"/static/oops.gif"} alt={t("errorMessage.title")} />
        <ErrorMessageContent>
          <ErrorMessageTitle id={applySkipToContentId ? SKIP_TO_CONTENT_ID : undefined}>
            {t("errorMessage.title")}
          </ErrorMessageTitle>
          <ErrorMessageDescription>{t("errorMessage.description")}</ErrorMessageDescription>
        </ErrorMessageContent>
        <ErrorMessageActions>
          <SafeLink to="/">{t("errorMessage.goToFrontPage")}</SafeLink>
        </ErrorMessageActions>
      </ErrorMessageRoot>
    </Status>
  );
};

export const DefaultErrorMessagePage = () => {
  const { t } = useTranslation();
  return (
    <PageContainer asChild consumeCss>
      <main>
        <PageTitle title={t("htmlTitles.errorPage")} />
        <DefaultErrorMessage applySkipToContentId={true} />
      </main>
    </PageContainer>
  );
};
