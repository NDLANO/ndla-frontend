/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button, DialogRoot, DialogTrigger } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { css } from "@ndla/styled-system/css";
import { routes } from "../../routeHelpers";
import { AuthContext } from "../AuthenticationContext";
import { LoginModalContent } from "../MyNdla/LoginModalContent";

interface Props {
  footer?: boolean;
  children?: ReactNode;
}

const buttonCss = css.raw({
  tabletDown: {
    paddingInline: "xsmall",
  },
});

export const FeideLoginButton = ({ children }: Props) => {
  const { t } = useTranslation();
  const { authenticated } = useContext(AuthContext);

  if (authenticated) {
    return (
      <SafeLinkButton variant="tertiary" css={buttonCss} to={routes.myNdla.root} aria-label={t("myNdla.myNDLA")}>
        {children}
      </SafeLinkButton>
    );
  }

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button variant="tertiary" css={buttonCss} aria-label={t("user.buttonLogIn")} title={t("user.buttonLogIn")}>
          {children}
        </Button>
      </DialogTrigger>
      <LoginModalContent masthead />
    </DialogRoot>
  );
};
