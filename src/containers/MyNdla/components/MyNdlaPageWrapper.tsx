/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HTMLAttributes } from 'react';
import styled from '@emotion/styled';
import { breakpoints, mq, spacing, spacingUnit } from '@ndla/core';
import { MY_NDLA_CONTENT_WIDTH } from '../../../constants';

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 ${spacing.nsmall} ${spacingUnit * 3}px ${spacing.nsmall};

  ${mq.range({ from: breakpoints.tablet })} {
    margin: 0 ${spacing.large} ${spacingUnit * 3}px ${spacing.large};
  }
`;

export const Content = styled.div`
  max-width: ${MY_NDLA_CONTENT_WIDTH}px;
  width: 100%;
`;

interface Props extends HTMLAttributes<HTMLDivElement> {}

const MyNdlaPageWrapper = ({ children }: Props) => (
  <ContentWrapper>
    <Content>{children}</Content>
  </ContentWrapper>
);

export default MyNdlaPageWrapper;
