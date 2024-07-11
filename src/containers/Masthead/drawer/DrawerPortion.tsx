/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HTMLAttributes } from "react";
import { Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

const DrawerPortion = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    minWidth: "300px",
    maxWidth: "400px",
    paddingLeft: "small",
    paddingRight: "small",
    borderLeft: "1px solid gray",
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
  },
});

export const StyledDrawerList = styled("ul", {
  base: {
    padding: "0",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
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
    padding: "0",
    listStyle: "none",
    display: "flex",
  },
});

export const DrawerHeader = styled(Heading, {
  base: {
    color: "text.default",
    textDecoration: "none",
    textStyle: "label.large",
    fontWeight: "bold",
    justifyContent: "start",
    alignItems: "center",
    padding: "small",
    width: "100%",
  },
});

export default DrawerPortion;
