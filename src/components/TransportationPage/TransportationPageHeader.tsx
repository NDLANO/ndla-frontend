/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { styled } from "@ndla/styled-system/jsx";

export const TransportationPageHeader = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "medium",
    justifyContent: "space-between",
    alignItems: "flex-end",
    justifyItems: "center",
    tabletWide: {
      gridTemplateColumns: "auto 360px",
    },
    "& figure": {
      "& img, iframe": {
        // TODO: Revise this clipPath. It's too steep?
        clipPath: "polygon(0 10%, 100% 0, 100% 100%, 0 100%)",
        width: "100%",
        aspectRatio: "4/3",
        objectFit: "cover",
        maxWidth: "365px",
        borderRadius: "0",
      },
      maxWidth: "365px",
    },
  },
});
