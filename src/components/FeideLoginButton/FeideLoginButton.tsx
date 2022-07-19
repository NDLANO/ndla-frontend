/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { AuthModal } from '@ndla/ui';
import Button, { StyledButton } from '@ndla/button';
import { spacing } from '@ndla/core';
import Modal, { ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import SafeLink from '@ndla/safelink';
import { AuthContext } from '../AuthenticationContext';
import LoginComponent from '../MyNdla/LoginComponent';
import IsMobileContext from '../../IsMobileContext';

const FeideButton = styled(StyledButton)`
  background: transparent;
  transition: background-color 200ms ease-in-out 0s;
  color: rgb(32, 88, 143);
  border: none;
  border-radius: 26px;
  font-weight: 400;
  padding: 13px 19.5px;
  font-size: 0.888889rem;
  line-height: 18px;

  &:hover {
    box-shadow: none;
    color: rgb(32, 88, 143);
    background-color: rgb(206, 221, 234);
    border: none;
  }

  svg {
    width: 22px;
    height: 22px;
  }
`;

const FeideFooterButton = styled(StyledButton)`
  padding: 4px 16px;
  background: transparent;
  color: rgb(255, 255, 255);
  border: 2px solid rgb(117, 117, 117);
  line-height: 18px;
  min-height: 48px;
`;

const StyledLink = styled(SafeLink)`
  display: flex;
  align-items: center;
  color: rgb(32, 88, 143);
  gap: ${spacing.small};
  box-shadow: none;
  margin-right: ${spacing.normal};
  &:hover {
    box-shadow: inset 0 -1px;
  }
  svg {
    width: 22px;
    height: 22px;
  }
`;

const MyNdlaButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${spacing.xxsmall};
`;

interface Props {
  footer?: boolean;
  children?: ReactNode;
}

const FeideLoginButton = ({ footer = false, children }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { authenticated, user } = useContext(AuthContext);
  const isMobile = useContext(IsMobileContext);
  const toString = isMobile ? '/minndla/meny' : '/minndla';

  if (authenticated && !footer) {
    return <StyledLink to={toString}>{children}</StyledLink>;
  }

  if (!authenticated && !footer) {
    return (
      <>
        <Modal
          backgroundColor="white"
          activateButton={<MyNdlaButton ghostPill>{children}</MyNdlaButton>}>
          {onClose => (
            <>
              <ModalHeader>
                <ModalCloseButton
                  title={t('modal.closeModal')}
                  onClick={onClose}
                />
              </ModalHeader>
              <ModalBody>
                <LoginComponent onClose={onClose} />
              </ModalBody>
            </>
          )}
        </Modal>
      </>
    );
  }

  return (
    <AuthModal
      activateButton={
        footer ? (
          <FeideFooterButton>{children}</FeideFooterButton>
        ) : (
          <FeideButton>{children}</FeideButton>
        )
      }
      isAuthenticated={authenticated}
      user={user}
      onAuthenticateClick={() => {
        location && localStorage.setItem('lastPath', location.pathname);
        if (authenticated) {
          navigate('/logout');
        } else {
          navigate('/login');
        }
      }}
    />
  );
};

export default FeideLoginButton;
