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
  ErrorMessageContent,
  ErrorMessageTitle,
  ErrorMessageActions,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { Status } from "../components";
import { SKIP_TO_CONTENT_ID } from "../constants";

const StyledErrorMessageRoot = styled(ErrorMessageRoot, {
  base: {
    marginBlock: "4xlarge",
  },
});

interface MessageRootProps {
  applySkipToContentId: boolean;
}

const MessageRoot = ({ applySkipToContentId }: MessageRootProps) => {
  const { t } = useTranslation();

  return (
    <StyledErrorMessageRoot>
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
    </StyledErrorMessageRoot>
  );
};

interface Props {
  skipRedirect?: boolean;
}

export const DefaultErrorMessage = ({ skipRedirect }: Props) => {
  if (skipRedirect) return <MessageRoot applySkipToContentId={false} />;

  return (
    <Status code={500}>
      <MessageRoot applySkipToContentId={true} />
    </Status>
  );
};
