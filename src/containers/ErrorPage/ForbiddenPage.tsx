/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Button,
  ErrorMessageActions,
  ErrorMessageContent,
  ErrorMessageDescription,
  ErrorMessageRoot,
  ErrorMessageTitle,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { HelmetWithTracker } from "@ndla/tracker";
import { Status } from "../../components";
import { PageContainer } from "../../components/Layout/PageContainer";
import { SKIP_TO_CONTENT_ID } from "../../constants";

interface Props {
  applySkipToContentId?: boolean;
}

export const Forbidden = ({ applySkipToContentId }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Status code={403}>
      <ErrorMessageRoot>
        <HelmetWithTracker title={t("htmlTitles.forbidden")} />
        <img src={"/static/not-exist.gif"} alt={t("errorMessage.title")} />
        <ErrorMessageContent>
          <ErrorMessageTitle id={applySkipToContentId ? SKIP_TO_CONTENT_ID : undefined}>
            {t("forbiddenPage.title")}
          </ErrorMessageTitle>
          <ErrorMessageDescription>{t("forbiddenPage.errorDescription")}</ErrorMessageDescription>
        </ErrorMessageContent>
        <ErrorMessageActions>
          <SafeLink to="/">{t("errorMessage.goToFrontPage")}</SafeLink>
          <Button variant="link" onClick={() => navigate(-1)}>
            {t("errorMessage.goBack")}
          </Button>
        </ErrorMessageActions>
      </ErrorMessageRoot>
    </Status>
  );
};

export const ForbiddenPage = () => {
  return (
    <PageContainer asChild consumeCss>
      <main>
        <Forbidden applySkipToContentId={true} />
      </main>
    </PageContainer>
  );
};
