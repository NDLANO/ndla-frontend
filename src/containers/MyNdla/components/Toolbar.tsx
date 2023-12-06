/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ReactNode, useContext } from 'react';
import { breakpoints, colors, mq, spacing, spacingUnit } from '@ndla/core';
import { MY_NDLA_CONTENT_WIDTH } from '../../../constants';
import { ViewType } from '../Folders/FoldersPage';
import MenuModalContent from './MenuModalContent';
import NotificationPopover from './NotificationPopover';
import { AuthContext } from '../../../components/AuthenticationContext';

const ToolbarContainer = styled.div`
  display: none;
  justify-content: center;
  border-bottom: 1px solid ${colors.brand.lightest};
  padding: ${spacing.small} ${spacing.large};
  min-height: ${spacingUnit * 3}px;

  ${mq.range({ from: breakpoints.mobileWide })} {
    display: flex;
  }
`;

const ButtonContainer = styled.div`
  display: none;
  flex-direction: row;
  gap: ${spacing.small};
  flex-wrap: wrap;

  ${mq.range({ from: breakpoints.wide })} {
    display: flex;
  }

  &[data-extend-tablet-view='false'] {
    ${mq.range({ from: breakpoints.desktop })} {
      display: flex;
    }
  }
`;

const DropdownWrapper = styled.div`
  display: none;

  ${mq.range({ from: breakpoints.mobileWide, until: breakpoints.desktop })} {
    display: unset;
  }

  &[data-extend-tablet-view='true'] {
    ${mq.range({ until: breakpoints.wide })} {
      display: unset;
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: space-between;

  max-width: ${MY_NDLA_CONTENT_WIDTH}px;

  div {
    flex-grow: 1;
  }
`;

interface Props {
  buttons?: ReactNode;
  dropDownMenu?: ReactNode;
  viewType?: ViewType;
  onViewTypeChange?: (val: ViewType) => void;
  extendTabletView?: boolean;
  showButtons?: boolean;
}

const Toolbar = ({
  buttons,
  dropDownMenu,
  onViewTypeChange,
  viewType,
  extendTabletView,
  showButtons,
}: Props) => {
  const { user } = useContext(AuthContext);
  return (
    <ToolbarContainer>
      <Wrapper>
        <div>
          <ButtonContainer data-extend-tablet-view={!!extendTabletView}>
            {buttons}
          </ButtonContainer>
          <DropdownWrapper data-extend-tablet-view={!!extendTabletView}>
            {dropDownMenu}
          </DropdownWrapper>
        </div>
        {user?.arenaEnabled && <NotificationPopover />}
      </Wrapper>
      <MenuModalContent
        onViewTypeChange={onViewTypeChange}
        buttons={buttons}
        viewType={viewType}
        showButtons={showButtons}
      />
    </ToolbarContainer>
  );
};
export default Toolbar;
