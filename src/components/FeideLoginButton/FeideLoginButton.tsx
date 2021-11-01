/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactElement, useContext } from 'react';
import { RouteProps } from 'react-router';

import Modal from '@ndla/modal';
import styled from '@emotion/styled';
import { StyledButton } from '@ndla/button';

import { AuthContext } from '../../components/AuthenticationContext';
import FeideLoginModal from './FeideLoginModal';
import FeideLogoutModal from './FeideLogoutModal';

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
  location: RouteProps['location'];
}

const FeideLoginButton = ({ footer, children, location }: Props) => {
  const { authenticated } = useContext(AuthContext);

  return (
    <Modal
      size="medium"
      activateButton={
        footer ? (
          <FeideFooterButton>{children}</FeideFooterButton>
        ) : (
          <FeideButton>{children}</FeideButton>
        )
      }
      animation="subtle"
      animationDuration={150}
      backgroundColor="grey"
      onClose={() => {}}>
      {(onClose: () => void) =>
        authenticated ? (
          <FeideLogoutModal onClose={onClose} location={location} />
        ) : (
          <FeideLoginModal onClose={onClose} location={location} />
        )
      }
    </Modal>
  );
};

FeideLoginButton.defaultProps = {
  footer: false,
};

export default FeideLoginButton;
