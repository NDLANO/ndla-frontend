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
import { colors, spacing } from '@ndla/core';
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
  display: flex;
  align-items: center;
  color: ${colors.brand.primary};
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

const FeideLoginButton = ({ footer, children }: Props) => {
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
      activateButton={<FeideFooterButton>{children}</FeideFooterButton>}
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
