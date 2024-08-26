/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useContext } from "react";
import { styled } from "@ndla/styled-system/jsx";
import MenuModalContent from "./MenuModalContent";
import NotificationPopover from "./NotificationPopover";
import { AuthContext } from "../../../components/AuthenticationContext";
import { ViewType } from "../Folders/FoldersPage";

const ToolbarContainer = styled("div", {
  base: {
    borderBottomColor: "stroke.subtle",
    borderBottom: "1px solid",
    display: "none",
    justifyContent: "center",
    minHeight: "fit-content",
    paddingBlock: "xxsmall",
    paddingInline: "xxlarge",

    mobileWide: {
      display: "flex",
    },

    "&[data-visible='false']": {
      display: "none !important",
    },
  },
});

const ButtonContainer = styled("ul", {
  base: {
    display: "none",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "4xsmall",
    listStyle: "none",
    margin: "0",
    padding: "0",

    desktop: {
      display: "flex",
    },
  },
});

const DropdownWrapper = styled("div", {
  base: {
    display: "none",
    mobileWideToDesktop: {
      display: "unset",
    },
  },
});

const Wrapper = styled("div", {
  base: {
    alignItems: "center",
    display: "flex",
    flexGrow: "1",
    justifyContent: "space-between",
    maxWidth: "surface.4xlarge",
  },
});

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
    <ToolbarContainer data-visible={!!buttons || !!dropDownMenu || !!user?.arenaEnabled}>
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
