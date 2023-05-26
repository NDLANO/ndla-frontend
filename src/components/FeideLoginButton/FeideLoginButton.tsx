/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { UserInfo } from '@ndla/ui';
import { ButtonV2 as Button, ButtonV2 } from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import { SafeLinkButton } from '@ndla/safelink';
import { FeideText, LogOut } from '@ndla/icons/common';
import { Modal, ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import { AuthContext } from '../AuthenticationContext';
import IsMobileContext from '../../IsMobileContext';
import { useIsNdlaFilm } from '../../routeHelpers';
import { constructNewPath, toHref } from '../../util/urlHelper';
import { useBaseName } from '../BaseNameContext';
import LoginModal from '../MyNdla/LoginModal';

const FeideFooterButton = styled(Button)`
  padding: ${spacing.xsmall} ${spacing.small};
  background: none;
  color: ${colors.white};
  border: 2px solid ${colors.brand.grey};
`;

const StyledLink = styled(SafeLinkButton)`
  display: flex;
  gap: ${spacing.small};
  margin-right: ${spacing.normal};
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
  const [isOpen, setIsOpen] = useState(false);
  const destination = isMobile ? '/minndla/meny' : '/minndla';

  const onClose = useCallback(() => setIsOpen(false), []);

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
      <>
        <Button
          variant={footer ? 'outline' : 'ghost'}
          colorTheme={footer ? 'greyLighter' : 'lighter'}
          onClick={() => setIsOpen(true)}
          inverted={!footer && ndlaFilm}
          shape={footer ? 'normal' : 'pill'}
        >
          {children}
        </Button>
        <LoginModal isOpen={isOpen} onClose={onClose} masthead />
      </>
    );
  }

  return (
    <Modal
      position="top"
      activateButton={<FeideFooterButton>{children}</FeideFooterButton>}
      aria-label={t('user.modal.isAuth')}
    >
      {(onClose: () => void) => (
        <>
          <ModalHeader>
            <StyledHeading aria-label="Feide">
              <FeideText aria-hidden />
            </StyledHeading>
            <ModalCloseButton onClick={onClose} title="Lukk" />
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
        </>
      )}
    </Modal>
  );
};

export default FeideLoginButton;
