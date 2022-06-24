/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AuthModal } from '@ndla/ui';
import styled from '@emotion/styled';
import { StyledButton } from '@ndla/button';

import { AuthContext } from '../AuthenticationContext';

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

interface Props {
  footer?: boolean;
  children?: ReactElement;
}

const FeideLoginButton = ({ footer, children }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticated, user } = useContext(AuthContext);

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

FeideLoginButton.defaultProps = {
  footer: false,
};

export default FeideLoginButton;
