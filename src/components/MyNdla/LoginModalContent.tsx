/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  Button,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Text,
} from "@ndla/primitives";
import { SafeLink, SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import parse from "html-react-parser";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { routes } from "../../routeHelpers";
import { toHref } from "../../util/urlHelper";
import { DialogCloseButton } from "../DialogCloseButton";

interface Props {
  title?: string;
  content?: ReactNode;
  masthead?: boolean;
  loginIngress?: string;
}

const LinkText = styled(Text, {
  base: {
    "& > a": {
      marginInlineStart: "3xsmall",
    },
  },
});

const StyledDialogBody = styled(DialogBody, {
  base: {
    textAlign: "start",
    gap: "medium",
  },
});

export const LoginModalContent = ({ title, content, masthead = false, loginIngress }: Props) => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title ?? t("myNdla.myPage.loginWelcome")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <StyledDialogBody>
        {content}
        <Text textStyle="body.xlarge">{loginIngress ?? parse(t("myNdla.myPage.loginIngress"))}</Text>
        <LinkText>
          {t("myNdla.myPage.loginText")}
          <SafeLink target="_blank" to="https://ndla.no/article/personvernerklaering">
            {t("myNdla.myPage.loginTextLink")}
          </SafeLink>
        </LinkText>
      </StyledDialogBody>
      <DialogFooter>
        <DialogCloseTrigger asChild>
          <Button variant="secondary">{t("cancel")}</Button>
        </DialogCloseTrigger>

        <SafeLinkButton reloadDocument to={`/login?returnTo=${masthead ? routes.myNdla.root : toHref(location)}`}>
          {t("user.buttonLogIn")}
        </SafeLinkButton>
      </DialogFooter>
    </DialogContent>
  );
};
