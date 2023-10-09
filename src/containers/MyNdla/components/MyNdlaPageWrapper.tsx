/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { breakpoints, mq, spacing } from '@ndla/core';
import { HTMLAttributes, ReactNode } from 'react';
import { MY_NDLA_CONTENT_WIDTH } from '../../../constants';
import Toolbar from './Toolbar';

const ContentWrapper = styled.div`
  padding: 0 ${spacing.large};
  display: flex;
  justify-content: center;
`;

const StyledToolbar = styled(Toolbar)`
  ${mq.range({ from: breakpoints.mobile, until: breakpoints.tablet })} {
    display: none;
  }
`;

export const Content = styled.div`
  max-width: ${MY_NDLA_CONTENT_WIDTH}px;
  width: 100%;
`;

interface Props extends HTMLAttributes<HTMLDivElement> {
  showToolbar?: boolean;
  dropDownMenu?: ReactNode;
  buttons?: ReactNode[];
}

const MyNdlaPageWrapper = ({
  showToolbar = true,
  buttons,
  dropDownMenu,
  children,
}: Props) => {
  return (
    <>
      {showToolbar && (
        <StyledToolbar buttons={buttons} dropDownMenu={dropDownMenu} />
      )}
      <ContentWrapper>
        <Content>{children}</Content>
      </ContentWrapper>
    </>
  );
};

export default MyNdlaPageWrapper;
