/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import {
  ErrorMessageDescription,
  ErrorMessageRoot,
  ErrorMessageTitle,
  ErrorMessageContent,
  ErrorMessageActions,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { HelmetWithTracker } from "@ndla/tracker";
import { Status } from "../../components";
import { PageContainer } from "../../components/Layout/PageContainer";
import { SKIP_TO_CONTENT_ID } from "../../constants";

interface BaseNotFoundProps {
  applySkipToContentId: boolean;
}
const BaseNotFound = ({ applySkipToContentId }: BaseNotFoundProps) => {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <HelmetWithTracker title={t("htmlTitles.notFound")} />
      <ErrorMessageRoot>
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
    </PageContainer>
  );
};

export const NotFound = ({ skipRedirect }: { skipRedirect?: boolean }) => {
  if (skipRedirect) return <BaseNotFound applySkipToContentId={false} />;
  return (
    <Status code={404}>
      <BaseNotFound applySkipToContentId={true} />
    </Status>
  );
};
