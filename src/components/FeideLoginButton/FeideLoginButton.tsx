/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { Modal, ModalTrigger } from "@ndla/modal";
import { SafeLinkButton } from "@ndla/safelink";
import { routes, useIsNdlaFilm } from "../../routeHelpers";
import { AuthContext } from "../AuthenticationContext";
import LoginModalContent from "../MyNdla/LoginModalContent";

const LoginButton = styled(ButtonV2)`
  white-space: nowrap;
`;

const StyledLink = styled(SafeLinkButton)`
  display: flex;
  gap: ${spacing.small};
  white-space: nowrap;
  svg {
    width: 20px;
    height: 20px;
  }
`;

interface Props {
  footer?: boolean;
  children?: ReactNode;
}

const FeideLoginButton = ({ footer, children }: Props) => {
  const { t } = useTranslation();
  const { authenticated } = useContext(AuthContext);
  const ndlaFilm = useIsNdlaFilm();

  if (authenticated) {
    return (
      <StyledLink
        variant="ghost"
        colorTheme="light"
        shape="pill"
        inverted={ndlaFilm}
        to={routes.myNdla.root}
        aria-label={t("myNdla.myNDLA")}
      >
        {children}
      </StyledLink>
    );
  }

  return (
    <Modal>
      <ModalTrigger>
        <LoginButton
          variant={footer ? "outline" : "ghost"}
          colorTheme={footer ? "greyLighter" : "lighter"}
          inverted={!footer && ndlaFilm}
          shape={footer ? "normal" : "pill"}
          aria-label={t("user.buttonLogIn")}
          title={t("user.buttonLogIn")}
        >
          {children}
        </LoginButton>
      </ModalTrigger>
      <LoginModalContent masthead />
    </Modal>
  );
};

export default FeideLoginButton;
