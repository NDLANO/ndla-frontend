/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { styled } from "@ndla/styled-system/jsx";

const TitleWrapper = styled("div", {
  base: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    gap: "medium",
    "& a": {
      color: "text.default",
    },
  },
});

export default TitleWrapper;
