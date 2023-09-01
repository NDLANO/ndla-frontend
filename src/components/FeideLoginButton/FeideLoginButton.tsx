/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { UserInfo } from '@ndla/ui';
import { ButtonV2 as Button, ButtonV2 } from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import { SafeLinkButton } from '@ndla/safelink';
import { FeideText, LogOut } from '@ndla/icons/common';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from '@ndla/modal';
import { AuthContext } from '../AuthenticationContext';
import IsMobileContext from '../../IsMobileContext';
import { useIsNdlaFilm } from '../../routeHelpers';
import { constructNewPath, toHref } from '../../util/urlHelper';
import { useBaseName } from '../BaseNameContext';
import LoginModalContent from '../MyNdla/LoginModalContent';

const FeideFooterButton = styled(Button)`
  padding: ${spacing.xsmall} ${spacing.small};
  background: none;
  color: ${colors.white};
  border: 2px solid ${colors.brand.grey};
`;

const LoginButton = styled(Button)`
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

const StyledHeading = styled.h1`
  margin: ${spacing.small} 0 0;
  svg {
    width: 82px;
    height: 28px;
    color: #000000;
  }
`;

const StyledButton = styled(ButtonV2)`
  display: flex;
  margin-top: ${spacing.normal};
`;

interface Props {
  footer?: boolean;
  children?: ReactNode;
}

const FeideLoginButton = ({ footer, children }: Props) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { authenticated, user } = useContext(AuthContext);
  const basename = useBaseName();
  const ndlaFilm = useIsNdlaFilm();
  const isMobile = useContext(IsMobileContext);
  const destination = isMobile ? '/minndla/meny' : '/minndla';

  if (authenticated && !footer) {
    return (
      <StyledLink
        variant="ghost"
        colorTheme="light"
        shape="pill"
        inverted={ndlaFilm}
        to={destination}
        aria-label={t('myNdla.myNDLA')}
      >
        {children}
      </StyledLink>
    );
  }

  if (!authenticated) {
    return (
      <Modal>
        <ModalTrigger>
          <LoginButton
            variant={footer ? 'outline' : 'ghost'}
            colorTheme={footer ? 'greyLighter' : 'lighter'}
            inverted={!footer && ndlaFilm}
            shape={footer ? 'normal' : 'pill'}
            aria-label={t('myNdla.myNDLA')}
            title={t('myNdla.myNDLA')}
          >
            {children}
          </LoginButton>
        </ModalTrigger>
        <LoginModalContent masthead />
      </Modal>
    );
  }

  return (
    <Modal aria-label={t('user.modal.isAuth')}>
      <ModalTrigger>
        <FeideFooterButton>{children}</FeideFooterButton>
      </ModalTrigger>
      <ModalContent position="top">
        <ModalHeader>
          <StyledHeading aria-label="Feide">
            <FeideText aria-hidden />
          </StyledHeading>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          {user && <UserInfo user={user} />}
          <StyledButton
            onClick={() => {
              window.location.href = constructNewPath(
                `/logout?state=${toHref(location)}`,
                basename,
              );
            }}
          >
            {t('user.buttonLogOut')}
            <LogOut />
          </StyledButton>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FeideLoginButton;
