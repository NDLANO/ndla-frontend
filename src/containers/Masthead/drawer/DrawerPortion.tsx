/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { styled } from "@ndla/styled-system/jsx";

const DrawerPortion = styled("div", {
  base: {
    display: "none",
    flexDirection: "column",
    border: "1px 1px 0 0",
    borderStyle: "solid",
    borderColor: "surface.brand.1",
    minWidth: "300px",
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

export const DrawerList = styled("ul", {
  base: {
    padding: "0",
    overflowY: "auto",
  },
});

export const DrawerListItem = styled("li", {
  base: {
    padding: "0",
    listStyle: "none",
    display: "flex",
  },
});

export default DrawerPortion;
