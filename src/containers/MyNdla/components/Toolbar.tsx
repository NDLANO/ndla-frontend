/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useContext } from "react";
import styled from "@emotion/styled";
import { breakpoints, colors, mq, spacing } from "@ndla/core";
import MenuModalContent from "./MenuModalContent";
import NotificationPopover from "./NotificationPopover";
import { AuthContext } from "../../../components/AuthenticationContext";
import { MY_NDLA_CONTENT_WIDTH } from "../../../constants";
import { ViewType } from "../Folders/FoldersPage";

const ToolbarContainer = styled.div`
  display: none;
  justify-content: center;
  border-bottom: 1px solid ${colors.brand.lightest};
  padding: ${spacing.small} ${spacing.large};
  min-height: fit-content;

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
  viewType?: ViewType;
  onViewTypeChange?: (val: ViewType) => void;
  showButtons?: boolean;
}

const Toolbar = ({ buttons, dropDownMenu, onViewTypeChange, viewType, showButtons }: Props) => {
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
        onViewTypeChange={onViewTypeChange}
        buttons={buttons}
        viewType={viewType}
        showButtons={showButtons}
      />
    </ToolbarContainer>
  );
};
export default Toolbar;
