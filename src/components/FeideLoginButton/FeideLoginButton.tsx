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
import { AuthModal } from '@ndla/ui';
import { ButtonV2 as Button } from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import { SafeLinkButton } from '@ndla/safelink';
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
    <AuthModal
      activateButton={<FeideFooterButton>{children}</FeideFooterButton>}
      isAuthenticated={authenticated}
      showGeneralMessage={false}
      user={user}
      onAuthenticateClick={() => {
        const route = authenticated ? 'logout' : 'login';
        window.location.href = constructNewPath(
          `/${route}?state=${toHref(location)}`,
          basename,
        );
      }}
    />
  );
};

export default FeideLoginButton;
