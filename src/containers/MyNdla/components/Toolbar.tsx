/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, ReactNode, SetStateAction, useContext } from 'react';
import styled from '@emotion/styled';
import { breakpoints, colors, mq, spacing, spacingUnit } from '@ndla/core';
import MenuModalContent from './MenuModalContent';
import NotificationPopover from './NotificationPopover';
import { AuthContext } from '../../../components/AuthenticationContext';
import { MY_NDLA_CONTENT_WIDTH } from '../../../constants';

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
  gap: ${spacing.xxsmall};
  flex-wrap: wrap;

  ${mq.range({ from: breakpoints.desktop })} {
    display: flex;
  }
`;

const DropdownWrapper = styled.div`
  display: none;

  ${mq.range({ from: breakpoints.mobileWide, until: breakpoints.desktop })} {
    display: unset;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  align-items: flex-start;

  max-width: ${MY_NDLA_CONTENT_WIDTH}px;

  div {
    flex-grow: 1;
  }
`;

interface Props {
  buttons?: ReactNode;
  dropDownMenu?: ReactNode;
  listView?: ReactNode;
  showButtons?: boolean;
  setResetFocus: Dispatch<SetStateAction<boolean>>;
  resetFocus: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Toolbar = ({
  buttons,
  dropDownMenu,
  listView,
  showButtons,
  setIsOpen,
  resetFocus,
  setResetFocus,
}: Props) => {
  const { user } = useContext(AuthContext);
  return (
    <ToolbarContainer>
      <Wrapper>
        <div>
          <ButtonContainer>{buttons}</ButtonContainer>
          <DropdownWrapper>{dropDownMenu}</DropdownWrapper>
        </div>
        {user?.arenaEnabled && <NotificationPopover />}
      </Wrapper>
      <MenuModalContent
        listView={listView}
        buttons={buttons}
        showButtons={showButtons}
        setIsOpen={setIsOpen}
        resetFocus={resetFocus}
        setResetFocus={setResetFocus}
      />
    </ToolbarContainer>
  );
};
export default Toolbar;
