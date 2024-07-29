/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalTrigger } from "@ndla/modal";
import { Button } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { routes } from "../../routeHelpers";
import { AuthContext } from "../AuthenticationContext";
import LoginModalContent from "../MyNdla/LoginModalContent";

interface Props {
  footer?: boolean;
  children?: ReactNode;
}

const FeideLoginButton = ({ children }: Props) => {
  const { t } = useTranslation();
  const { authenticated } = useContext(AuthContext);

  if (authenticated) {
    return (
      <SafeLinkButton variant="tertiary" to={routes.myNdla.root} aria-label={t("myNdla.myNDLA")}>
        {children}
      </SafeLinkButton>
    );
  }

  return (
    <Modal>
      <ModalTrigger>
        <Button variant="tertiary" aria-label={t("user.buttonLogIn")} title={t("user.buttonLogIn")}>
          {children}
        </Button>
      </ModalTrigger>
      <LoginModalContent masthead />
    </Modal>
  );
};

export default FeideLoginButton;
