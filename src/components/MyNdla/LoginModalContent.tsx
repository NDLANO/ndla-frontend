/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import styled from '@emotion/styled';
import {
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
} from '@ndla/modal';
import { Heading } from '@ndla/typography';
import LoginComponent from './LoginComponent';

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
    <ModalContent>
      <ModalHeader>
        <Heading element="h1" headingStyle="default">
          {title}
        </Heading>
        <ModalCloseButton />
      </ModalHeader>
      <StyledModalBody>
        <LoginComponent content={content} masthead={masthead} />
      </StyledModalBody>
    </ModalContent>
  );
};

export default LoginModalContent;
