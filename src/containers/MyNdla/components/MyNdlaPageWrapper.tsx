/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentPropsWithoutRef, ReactNode } from "react";
import { styled } from "@ndla/styled-system/jsx";
import { JsxStyleProps } from "@ndla/styled-system/types";
import Toolbar from "./Toolbar";
import { PageContainer } from "../../../components/Layout/PageContainer";

interface Props extends ComponentPropsWithoutRef<"div">, JsxStyleProps {
  dropDownMenu?: ReactNode;
  buttons?: ReactNode;
  showButtons?: boolean;
}

const StyledPageContainer = styled(PageContainer, {
  base: {
    gap: "medium",
  },
});

const MyNdlaPageWrapper = ({ buttons, dropDownMenu, showButtons, children, ...rest }: Props) => {
  return (
    <>
      <Toolbar buttons={buttons} dropDownMenu={dropDownMenu} showButtons={showButtons} />
      <StyledPageContainer {...rest} padding="small" asChild consumeCss>
        <main>{children}</main>
      </StyledPageContainer>
    </>
  );
};

export default MyNdlaPageWrapper;
