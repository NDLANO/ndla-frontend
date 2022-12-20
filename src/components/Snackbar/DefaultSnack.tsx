/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { ReactNode } from 'react';

const StyledResourceAddedSnack = styled.div`
  gap: ${spacing.small};
  display: flex;
`;

const StyledResource = styled.p`
  margin: 0;
`;

interface Props {
  children: ReactNode;
}

const DefaultSnack = ({ children }: Props) => {
  return (
    <StyledResourceAddedSnack>
      <StyledResource>{children}</StyledResource>
    </StyledResourceAddedSnack>
  );
};

export default DefaultSnack;
