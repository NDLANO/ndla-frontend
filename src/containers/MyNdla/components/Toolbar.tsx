/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ReactNode } from 'react';
import { breakpoints, colors, mq, spacing, spacingUnit } from '@ndla/core';
import { myNdlaContentWidth } from '../../../constants';

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid ${colors.brand.lighter};
  padding: ${spacing.small} ${spacing.large};
  height: ${spacingUnit * 3};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${spacing.small};

  ${mq.range({ until: breakpoints.desktop })} {
    display: none;
  }
`;

const DropdownWrapper = styled.div`
  ${mq.range({ from: breakpoints.desktop })} {
    display: none;
  }
`;

const StyledDiv = styled.div`
  display: flex;
  max-width: ${myNdlaContentWidth}px;
  flex-grow: 1;
  justify-content: space-between;
`;

interface Props {
  buttons?: ReactNode[];
  dropDownMenu?: ReactNode;
}

const Toolbar = ({ buttons, dropDownMenu, ...rest }: Props) => {
  return (
    <ToolbarContainer {...rest}>
      <StyledDiv>
        <ButtonContainer>{buttons}</ButtonContainer>
        <DropdownWrapper>{dropDownMenu}</DropdownWrapper>
      </StyledDiv>
    </ToolbarContainer>
  );
};

export default Toolbar;
