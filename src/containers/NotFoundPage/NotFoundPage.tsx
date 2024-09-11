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
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker } from "@ndla/tracker";
import { Status } from "../../components";

const StyledErrorMessageRoot = styled(ErrorMessageRoot, {
  base: {
    marginBlock: "4xlarge",
  },
});

const BaseNotFound = () => {
  const { t } = useTranslation();
  return (
    <>
      <HelmetWithTracker title={t("htmlTitles.notFound")} />
      <StyledErrorMessageRoot>
        <img src={"/static/not-exist.gif"} alt={t("errorMessage.title")} />
        <ErrorMessageContent>
          <ErrorMessageTitle>{t("notFoundPage.title")}</ErrorMessageTitle>
          <ErrorMessageDescription>{t("notFoundPage.errorDescription")}</ErrorMessageDescription>
        </ErrorMessageContent>
        <ErrorMessageActions>
          <SafeLink to="/">{t("errorMessage.goToFrontPage")}</SafeLink>
        </ErrorMessageActions>
      </StyledErrorMessageRoot>
    </>
  );
};

export const NotFound = ({ skipRedirect }: { skipRedirect?: boolean }) => {
  if (skipRedirect) return <BaseNotFound />;
  return (
    <Status code={404}>
      <BaseNotFound />
    </Status>
  );
};
