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
import { MY_NDLA_CONTENT_WIDTH } from '../../../constants';
import { ViewType } from '../Folders/FoldersPage';
import MenuModalContent from './MenuModalContent';

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid ${colors.brand.lighter};
  padding: ${spacing.small} ${spacing.large};
  height: ${spacingUnit * 3}px;

  ${mq.range({ until: breakpoints.mobileWide })} {
    display: none;
  }
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

const Wrapper = styled.div`
  display: flex;
  max-width: ${MY_NDLA_CONTENT_WIDTH}px;
  flex-grow: 1;
  justify-content: space-between;
`;

interface Props {
  buttons?: ReactNode;
  dropDownMenu?: ReactNode;
  viewType?: ViewType;
  onViewTypeChange?: (val: ViewType) => void;
}

const Toolbar = ({
  buttons,
  dropDownMenu,
  onViewTypeChange,
  viewType,
}: Props) => {
  return (
    <ToolbarContainer>
      <Wrapper>
        <ButtonContainer>{buttons}</ButtonContainer>
        <DropdownWrapper>{dropDownMenu}</DropdownWrapper>
      </Wrapper>
      <MenuModalContent
        onViewTypeChange={onViewTypeChange}
        buttons={buttons}
        viewType={viewType}
      />
    </ToolbarContainer>
  );
};

export default Toolbar;
