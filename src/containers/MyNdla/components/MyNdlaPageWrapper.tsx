/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HTMLAttributes, ReactNode } from "react";
import { styled } from "@ndla/styled-system/jsx";
import { OneColumn } from "@ndla/ui";
import Toolbar from "./Toolbar";
import { ViewType } from "../Folders/FoldersPage";

const ContentWrapper = styled("main", {
  base: {
    display: "flex",
    justifyContent: "center",
    marginInline: "small",
    marginBlockStart: "small",
    marginBlockEnd: "3xlarge",
    tablet: {
      marginInline: "xxlarge",
      marginBlockStart: "0",
      marginBlockEnd: "3xlarge",
    },
    mobile: {
      marginInline: "unset",
    },
  },
});

export const Content = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
    width: "100%",
  },
});

interface Props extends HTMLAttributes<HTMLDivElement> {
  dropDownMenu?: ReactNode;
  buttons?: ReactNode;
  viewType?: ViewType;
  onViewTypeChange?: (val: ViewType) => void;
  showButtons?: boolean;
}

const MyNdlaPageWrapper = ({ buttons, dropDownMenu, onViewTypeChange, viewType, showButtons, children }: Props) => {
  return (
    <>
      <Toolbar
        buttons={buttons}
        dropDownMenu={dropDownMenu}
        onViewTypeChange={onViewTypeChange}
        viewType={viewType}
        showButtons={showButtons}
      />
      <ContentWrapper>
        <OneColumn>
          <Content>{children}</Content>
        </OneColumn>
      </ContentWrapper>
    </>
  );
};

export default MyNdlaPageWrapper;
