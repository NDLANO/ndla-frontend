/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HTMLAttributes, ReactNode } from "react";
import { styled } from "@ndla/styled-system/jsx";
import Toolbar from "./Toolbar";
import { ViewType } from "../Folders/FoldersPage";

const ContentWrapper = styled("main", {
  base: {
    display: "flex",
    justifyContent: "center",
    margin: "9",
    marginTop: "9",
    marginBottom: "3xlarge",
    tablet: {
      margin: "xxlarge",
      marginTop: "0",
      marginBottom: "3xlarge",
    },
  },
});

export const Content = styled("div", {
  base: {
    maxWidth: "surface.4xlarge",
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
        <Content>{children}</Content>
      </ContentWrapper>
    </>
  );
};

export default MyNdlaPageWrapper;
