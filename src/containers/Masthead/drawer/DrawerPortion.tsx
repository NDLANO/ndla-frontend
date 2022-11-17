/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DetailedHTMLProps, HTMLAttributes } from 'react';
import styled from '@emotion/styled';
import { breakpoints, colors, mq } from '@ndla/core';

const StyledDiv = styled.div`
  display: none;
  flex-direction: column;
  border-right: 1px solid ${colors.brand.neutral7};
  border-top: 1px solid ${colors.brand.neutral7};
  min-width: 300px;
  ${mq.range({ until: breakpoints.tablet })} {
    :nth-last-of-type(-n + 1) {
      display: flex;
      flex: 1;
    }
  }
  ${mq.range({ from: breakpoints.tablet })} {
    :nth-last-of-type(-n + 2) {
      display: flex;
      max-width: 450px;
    }
  }
  ${mq.range({ from: breakpoints.desktop })} {
    :nth-last-of-type(-n + 3) {
      display: flex;
      max-width: 450px;
    }
  }
`;
const DrawerPortion = ({
  children,
  ...rest
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return <StyledDiv {...rest}>{children}</StyledDiv>;
};

export default DrawerPortion;
