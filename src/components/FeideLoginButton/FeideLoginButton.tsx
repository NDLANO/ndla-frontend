import React, { ReactElement } from 'react';

import Modal from '@ndla/modal';
import styled from '@emotion/styled';
import { StyledButton } from '@ndla/button';

import FeideLoginModal from './FeideLoginModal';

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
      {(onClose: () => void) => <FeideLoginModal onClose={onClose} />}
    </Modal>
  );
};

FeideLoginButton.defaultProps = {
  footer: false,
};

export default FeideLoginButton;
