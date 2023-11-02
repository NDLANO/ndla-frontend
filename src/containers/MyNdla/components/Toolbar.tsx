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
  display: none;
  justify-content: center;
  border-bottom: 1px solid ${colors.brand.lighter};
  padding: ${spacing.small} ${spacing.large};
  height: ${spacingUnit * 3}px;

  ${mq.range({ from: breakpoints.mobileWide })} {
    display: flex;
  }
`;

const ButtonContainer = styled.div`
  display: none;
  flex-direction: row;
  gap: ${spacing.small};

  @container (min-width:600px) {
    display: flex;
  }

  ${mq.range({ from: breakpoints.mobileWide, until: breakpoints.desktop })} {
    &[data-hide-buttons='true'] {
      display: none;
    }
  }
`;

const DropdownWrapper = styled.div`
  display: none;

  ${mq.range({ from: breakpoints.mobileWide, until: breakpoints.desktop })} {
    @container (max-width:600px) {
      display: unset;
    }
    &[data-always-show='true'] {
      display: unset;
    }
  }
`;

const Wrapper = styled.div`
  container-type: inline-size;
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
  numberOfButtons?: number;
}

const Toolbar = ({
  buttons,
  dropDownMenu,
  onViewTypeChange,
  viewType,
  numberOfButtons,
}: Props) => {
  const tooManyButtons = (numberOfButtons ?? 1) > 4;

  return (
    <ToolbarContainer>
      <Wrapper>
        <ButtonContainer data-hide-buttons={tooManyButtons}>
          {buttons}
        </ButtonContainer>
        <DropdownWrapper data-always-show={tooManyButtons}>
          {dropDownMenu}
        </DropdownWrapper>
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
