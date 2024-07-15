/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HTMLAttributes } from "react";
import { Heading } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";

const DrawerPortion = styled("div", {
  base: {
    display: "none",
    flexDirection: "column",
    minWidth: "surface.xsmall",
    maxWidth: "surface.small",
    paddingInline: "medium",
    paddingBlockStart: "xlarge",
    paddingBlockEnd: "medium",
    borderLeft: "1px solid ",
    borderTop: "1px solid ",
    borderColor: "stroke.subtle",
    tabletDown: {
      "&:nth-last-of-type(-n + 1)": {
        display: "flex",
        flex: "1",
      },
    },
    tabletToDesktop: {
      "&:nth-last-of-type(-n + 2)": {
        display: "flex",
        flex: "1",
      },
    },
    desktop: {
      "&:nth-last-of-type(-n + 3)": {
        display: "flex",
        flex: "1",
      },
    },
    _first: {
      borderLeft: "none",
    },
  },
});

export const StyledDrawerList = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
  },
});

export const DrawerList = ({ children, ...rest }: HTMLAttributes<HTMLUListElement>) => {
  return (
    <StyledDrawerList role="menubar" aria-orientation="vertical" {...rest}>
      {children}
    </StyledDrawerList>
  );
};

export const DrawerListItem = styled("li", {
  base: {
    listStyle: "none",
    display: "flex",
  },
});

export const DrawerHeader = styled(Heading, {
  base: {
    textAlign: "start",
    color: "text.default",
    paddingInline: "small",
    paddingBlockStart: "small",
  },
});

export const DrawerHeaderLink = styled(SafeLinkButton, {
  base: {
    textAlign: "start",
    color: "text.default",
    textStyle: "title.medium",
    fontWeight: "bold",
    paddingInline: "small",
    paddingBlockEnd: "small",
  },
});

export default DrawerPortion;
