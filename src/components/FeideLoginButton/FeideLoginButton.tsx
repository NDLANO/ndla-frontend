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
import Button, { appearances, StyledButton } from '@ndla/button';
import { colors, fonts, spacing } from '@ndla/core';
import Modal, { ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import SafeLink from '@ndla/safelink';
import { AuthContext } from '../AuthenticationContext';
import LoginComponent from '../MyNdla/LoginComponent';
import IsMobileContext from '../../IsMobileContext';

const FeideFooterButton = styled(StyledButton)`
  padding: ${spacing.xsmall} ${spacing.small};
  background: none;
  color: ${colors.white};
  border: 2px solid ${colors.brand.grey};
`;

const StyledLink = styled(SafeLink)`
  ${appearances.ghostPill};
  display: flex;
  align-items: center;
  color: ${colors.brand.primary};
  gap: ${spacing.small};
  box-shadow: none;
  font-size: 16px;
  margin-right: ${spacing.normal};
  font-weight: ${fonts.weight.semibold};
  svg {
    width: 20px;
    height: 20px;
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
  to?: string;
}

const FeideLoginButton = ({ footer, children, to }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { authenticated, user } = useContext(AuthContext);
  const isMobile = useContext(IsMobileContext);
  const destination = isMobile ? '/minndla/meny' : '/minndla';

  if (authenticated && !footer) {
    return <StyledLink to={destination}>{children}</StyledLink>;
  }

  if (!authenticated && !footer) {
    return (
      <>
        <Modal
          backgroundColor="white"
          activateButton={<MyNdlaButton ghostPill>{children}</MyNdlaButton>}
          label={t('user.modal.isNotAuth')}>
          {onClose => (
            <>
              <ModalHeader>
                <ModalCloseButton
                  title={t('modal.closeModal')}
                  onClick={onClose}
                />
              </ModalHeader>
              <ModalBody>
                <LoginComponent to={to} onClose={onClose} />
              </ModalBody>
            </>
          )}
        </Modal>
      </>
    );
  }

  return (
    <AuthModal
      activateButton={<FeideFooterButton>{children}</FeideFooterButton>}
      isAuthenticated={authenticated}
      user={user}
      onAuthenticateClick={() => {
        if (authenticated) {
          navigate('/logout', { state: { from: location.pathname } });
        } else {
          navigate('/login', { state: { from: location.pathname } });
        }
      }}
    />
  );
};

export default FeideLoginButton;
