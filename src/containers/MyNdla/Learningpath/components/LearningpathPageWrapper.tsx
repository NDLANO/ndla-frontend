/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentPropsWithoutRef } from "react";
import { PageContainer } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { JsxStyleProps } from "@ndla/styled-system/types";
import { MenuItemProps } from "../../components/SettingsMenu";
import Toolbar from "../../components/Toolbar";

interface Props extends ComponentPropsWithoutRef<"div">, JsxStyleProps {
  menuItems?: MenuItemProps[];
  showButtons?: boolean;
}

const StyledPageContainer = styled(PageContainer, {
  base: {
    gap: "medium",
    "& *": {
      maxWidth: "surface.contentMax",
    },
  },
});

const LearningpathPageWrapper = ({ menuItems, showButtons, children, ...rest }: Props) => {
  return (
    <>
      <Toolbar menuItems={menuItems} showButtons={showButtons} />
      <StyledPageContainer {...rest} padding="small" asChild consumeCss>
        <main>{children}</main>
      </StyledPageContainer>
    </>
  );
};

export default LearningpathPageWrapper;
