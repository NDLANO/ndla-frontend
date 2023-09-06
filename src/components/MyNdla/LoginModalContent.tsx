/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
} from '@ndla/modal';
import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { breakpoints, fonts, mq } from '@ndla/core';
import LoginComponent from './LoginComponent';

const Title = styled.h1`
  margin-bottom: 0;
  ${fonts.sizes('30px')};
  ${mq.range({ until: breakpoints.tablet })} {
    ${fonts.sizes('20px')};
  }
`;

interface Props {
  title?: string;
  content?: ReactNode;
  masthead?: boolean;
}

const StyledModalBody = styled(ModalBody)`
  h2 {
    margin: 0;
  }
`;

const LoginModalContent = ({ title, content, masthead = false }: Props) => {
  return (
    <ModalContent forceOverlay>
      <ModalHeader>
        <Title>{title}</Title>
        <ModalCloseButton />
      </ModalHeader>
      <StyledModalBody>
        <LoginComponent content={content} masthead={masthead} />
      </StyledModalBody>
    </ModalContent>
  );
};

export default LoginModalContent;
