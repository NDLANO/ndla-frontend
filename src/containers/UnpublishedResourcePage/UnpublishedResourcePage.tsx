/**
 * Copyright (c) 2024-present, NDLA.
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
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker } from "@ndla/tracker";
import { Status } from "../../components";
import { SKIP_TO_CONTENT_ID } from "../../constants";

const StyledErrorMessageRoot = styled(ErrorMessageRoot, {
  base: {
    marginBlockStart: "4xlarge",
  },
});

const UnpublishedResource = () => {
  const { t } = useTranslation();
  return (
    <Status code={410}>
      <HelmetWithTracker title={t("htmlTitles.unpublished")} />
      <StyledErrorMessageRoot>
        <img src={"/static/not-exist.gif"} alt={t("errorMessage.title")} />
        <ErrorMessageContent>
          <ErrorMessageTitle id={SKIP_TO_CONTENT_ID}>{t("unpublishedResourcePage.title")}</ErrorMessageTitle>
          <ErrorMessageDescription>{t("unpublishedResourcePage.errorDescription")}</ErrorMessageDescription>
        </ErrorMessageContent>
        <ErrorMessageActions>
          <SafeLink to="/">{t("errorMessage.goToFrontPage")}</SafeLink>
        </ErrorMessageActions>
      </StyledErrorMessageRoot>
    </Status>
  );
};

export default UnpublishedResource;
